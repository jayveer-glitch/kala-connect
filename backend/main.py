from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
import os
import io
from dotenv import load_dotenv
import google.generativeai as genai
from PIL import Image
from pydantic import BaseModel
from typing import List
import requests
import json
import base64
import firebase_admin
from firebase_admin import credentials, firestore
from pathlib import Path
import qrcode
import qrcode
from prompts import MASTER_STORYTELLER_PROMPT
from prompts import MASTER_MOCKUP_PROMPT


class StoryData(BaseModel):
    initial_description: str
    artisan_answers: List[str]

class MockupRequest(BaseModel):
    context: str

# File upload configuration
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB limit
ALLOWED_EXTENSIONS = {'.jpg', '.jpeg', '.png', '.gif', '.webp'}
ALLOWED_MIME_TYPES = {'image/jpeg', 'image/png', 'image/gif', 'image/webp'}

def validate_file_size(content: bytes) -> bool:
    """Validate if file size is within limits"""
    return len(content) <= MAX_FILE_SIZE

def validate_file_type(filename: str, content_type: str) -> bool:
    """Validate if file type is allowed"""
    if not filename:
        return False
    
    ext = Path(filename).suffix.lower()
    return ext in ALLOWED_EXTENSIONS and content_type in ALLOWED_MIME_TYPES

async def process_uploaded_file(file: UploadFile) -> bytes:
    """Process and validate uploaded file"""
    # Read file content
    content = await file.read()
    
    # Validate file size
    if not validate_file_size(content):
        raise HTTPException(
            status_code=413, 
            detail=f"File too large. Maximum size: {MAX_FILE_SIZE // (1024*1024)}MB"
        )
    
    # Validate file type
    if not validate_file_type(file.filename or "", file.content_type or ""):
        raise HTTPException(
            status_code=400, 
            detail="Invalid file type. Allowed: JPG, JPEG, PNG, GIF, WEBP"
        )
    
    # Reset file pointer for further processing
    await file.seek(0)
    return content

# Load environment variables from .env file
load_dotenv()

# Initialize Firebase only if credentials are available
firebase_enabled = False
try:
    firebase_credentials = {
        "type": os.getenv("FIREBASE_TYPE", "service_account"),
        "project_id": os.getenv("FIREBASE_PROJECT_ID"),
        "private_key_id": os.getenv("FIREBASE_PRIVATE_KEY_ID"),
        "private_key": os.getenv("FIREBASE_PRIVATE_KEY", "").replace('\\n', '\n'),
        "client_email": os.getenv("FIREBASE_CLIENT_EMAIL"),
        "client_id": os.getenv("FIREBASE_CLIENT_ID"),
        "auth_uri": os.getenv("FIREBASE_AUTH_URI", "https://accounts.google.com/o/oauth2/auth"),
        "token_uri": os.getenv("FIREBASE_TOKEN_URI", "https://oauth2.googleapis.com/token"),
        "auth_provider_x509_cert_url": os.getenv("FIREBASE_AUTH_PROVIDER_X509_CERT_URL", "https://www.googleapis.com/oauth2/v1/certs"),
        "client_x509_cert_url": os.getenv("FIREBASE_CLIENT_X509_CERT_URL")
    }

    # Check if all required env vars are present
    required_vars = ["project_id", "private_key", "client_email"]
    missing_vars = [var for var in required_vars if not firebase_credentials[var]]

    if not missing_vars:
        cred = credentials.Certificate(firebase_credentials)
        firebase_admin.initialize_app(cred)
        db = firestore.client()
        firebase_enabled = True
        print("✅ Firebase initialized successfully")
    else:
        print(f"⚠️ Firebase disabled - missing environment variables: {missing_vars}")
        print("ℹ️ QR code story features will be unavailable, but core functionality works fine!")
        db = None
except Exception as e:
    print(f"⚠️ Firebase initialization failed: {e}")
    print("ℹ️ QR code story features will be unavailable, but core functionality works fine!")
    firebase_enabled = False
    db = None


app = FastAPI()

# Configure CORS origins based on environment
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")
ALLOWED_ORIGINS = [
    "http://localhost:3000",  # Local development
    "http://localhost:3001",  # Alternative local port
    FRONTEND_URL,  # Production frontend URL
]

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure the Gemini API
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
model = genai.GenerativeModel('gemini-2.5-flash-lite')

@app.get("/")
def read_root():
    return {"Status": "KalaConnect Backend is Online"}

@app.get("/status")
def check_status():
    """Check if all required environment variables are set"""
    google_api_key = os.getenv("GOOGLE_API_KEY")
    openrouter_api_key = os.getenv("OPENROUTER_API_KEY")
    
    return {
        "status": "online",
        "google_api_key_set": bool(google_api_key and len(google_api_key) > 10),
        "openrouter_api_key_set": bool(openrouter_api_key and len(openrouter_api_key) > 10),
        "static_directory_exists": os.path.exists("static")
    }

@app.get("/test-ai")
def test_ai():
    try:
        # This is a simple test call to the AI
        response = model.generate_content("In one sentence, what makes handmade crafts special?")
        return {"ai_response": response.text}
    except Exception as e:
        return {"error": str(e)}
    
@app.post("/generate-story")
async def generate_story_from_image(
    image: UploadFile = File(...),
    category: str = Form(...) # <-- Accept the category here
):
    """
    Receives an image and its category, sends to Gemini Vision,
    and returns initial analysis/questions.
    """
    try:
        # Validate and process uploaded file
        contents = await process_uploaded_file(image)
        pil_image = Image.open(io.BytesIO(contents))

        # Enhanced vision prompt for detailed art analysis
        vision_prompt = [
            f"""
            You are an expert in traditional crafts and cultural arts. Analyze this image of a handmade craft, which the artisan has identified as being in the '{category}' category.

            Provide a comprehensive analysis including:
            1. Detailed description of what you see (materials, techniques, patterns, colors, style)
            2. Identify the specific traditional art form if recognizable (e.g., Madhubani painting, Bidriware, Chikankari embroidery, etc.)
            3. Analyze regional characteristics and cultural elements visible
            4. Assess the level of craftsmanship and traditional techniques used
            5. Generate three thoughtful, warm questions that will help capture the artisan's personal story and connection to this craft

            Format the output as JSON with these exact keys:
            {{
              "description": "Detailed description of the craft piece including materials, techniques, and visual elements",
              "art_form_identification": "Specific traditional art form name if identifiable, or 'Unknown traditional craft' if not certain",
              "regional_characteristics": "Observable cultural or regional elements in the style, patterns, or techniques",
              "craftsmanship_analysis": "Assessment of skill level, traditional techniques, and unique features",
              "questions": [
                "Question 1 about the artisan's learning/training in this craft",
                "Question 2 about cultural significance or family traditions",
                "Question 3 about the creation process or personal connection to the work"
              ]
            }}
            
            Make your analysis culturally sensitive and respectful while being informative and detailed.
            """,
            pil_image
        ]
        
        # ... (the rest of the function is the same)
        response = model.generate_content(vision_prompt)
        return {"ai_analysis": response.text}

    except Exception as e:
        return {"error": f"An error occurred: {str(e)}"}
    
@app.post("/complete-story")
async def complete_story(data: StoryData):
    """
    Receives the initial analysis and the artisan's answers,
    then generates the final marketing content.
    """
    try:
        # Combine the answers into a single string for the prompt
        answers_str = "\n- ".join(data.artisan_answers)

        # Format the master prompt with our data
        final_prompt = MASTER_STORYTELLER_PROMPT.format(
            description=data.initial_description,
            answers=answers_str
        )

        # Call the model
        response = model.generate_content(final_prompt)
        # Clean up the response to get a clean JSON object
        story_json_str = response.text.strip().replace("```json", "").replace("```", "")
        story_data = json.loads(story_json_str)

        # Save to Firebase if available, otherwise just return the story
        if firebase_enabled and db:
            try:
                doc_ref = db.collection(u'stories').add(story_data)
                story_id = doc_ref[1].id
                return {"story_id": story_id, "final_content": story_data}
            except Exception as firebase_error:
                print(f"Firebase save failed: {firebase_error}")
                # Continue without saving
                pass
        
        # Return content without story_id for MVP (no QR code functionality)
        return {"final_content": story_data}

    except Exception as e:
        return {"error": f"An error occurred: {str(e)}"}

class PricingRequest(BaseModel):
    description: str
    category: str
    time_taken_hours: int

@app.post("/get-pricing")
async def get_pricing(request: PricingRequest):
    """
    Suggests a price range based on the item's details.
    """
    try:
        text_model = genai.GenerativeModel('gemini-pro')
        prompt = f"""
        Act as an expert appraiser for handmade artisanal goods.
        Given the following item details:
        - Category: {request.category}
        - Description: {request.description}
        - Hours to make: {request.time_taken_hours}

        Provide a fair market price range in both INR and USD.
        Your output MUST be a JSON object with two keys: "price_range_inr" and "price_range_usd".
        Example: {{"price_range_inr": "₹2500 - ₹4000", "price_range_usd": "$30 - $50"}}
        """
        response = text_model.generate_content(prompt)
        return {"pricing_suggestion": response.text}
    except Exception as e:
        return {"error": str(e)}    
    
app.mount("/static", StaticFiles(directory="static"), name="static")


@app.post("/generate-mockup")
async def generate_mockup(
    image: UploadFile = File(...),
    context: str = Form(...)
):
    """
    Tests the OpenRouter Chat Completions endpoint for image generation.
    """
    try:
        openrouter_key = os.getenv("OPENROUTER_API_KEY")
        
        # Validate and process uploaded file
        contents = await process_uploaded_file(image)
        
        # 1. Encode the uploaded image
        image_base64 = base64.b64encode(contents).decode("utf-8")
        image_url = f"data:image/jpeg;base64,{image_base64}"

        # 2. Craft the generation prompt using the professional prompt
        prompt = MASTER_MOCKUP_PROMPT.format(context=context)

        # 3. Make the API call exactly as requested
        response = requests.post(
            url="https://openrouter.ai/api/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {openrouter_key}",
                "Content-Type": "application/json",
            },
            data=json.dumps({
                "model": "google/gemini-2.5-flash-image-preview", # Using FLUX Pro model for high-quality image generation
                "messages": [
                    {
                        "role": "user",
                        "content": [
                            { "type": "text", "text": prompt },
                            { "type": "image_url", "image_url": { "url": image_url } }
                        ]
                    }
                ]
            })
        )
        # 1. Print the status code and the raw response to your terminal for debugging
        print(f"DEBUG: Status Code from OpenRouter: {response.status_code}")
        
        if response.status_code != 200:
            error_text = response.text
            print(f"DEBUG: Error response: {error_text}")
            return {"error": f"OpenRouter API error: {response.status_code} - {error_text}"}
            
        response_json = response.json()
        print(f"DEBUG: Full response: {response_json}")
        
        message = response_json["choices"][0]["message"]
        base64_url = None
        
        # Try different response formats
        if "images" in message and message["images"]:
            base64_url = message["images"][0]["image_url"]["url"]
        elif "content" in message and isinstance(message["content"], list):
            # Some models return content as a list
            for content_item in message["content"]:
                if content_item.get("type") == "image_url":
                    base64_url = content_item["image_url"]["url"]
                    break
        elif "content" in message and isinstance(message["content"], str):
            # Some models might return the base64 directly in content
            if message["content"].startswith("data:image"):
                base64_url = message["content"]

        if not base64_url:
            print(f"DEBUG: Could not find image in response: {message}")
            return {"error": f"API response was successful, but no image data was found. Response structure: {message}"}

        # 3. Decode and save the image
        header, base64_string = base64_url.split(",", 1)
        image_data = base64.b64decode(base64_string)
        
        output_filename = f"generated_or_{image.filename}"
        output_filepath = os.path.join("static", output_filename)
        os.makedirs("static", exist_ok=True)
        
        with open(output_filepath, "wb") as f:
            f.write(image_data)
        
        return {
            "status": "Mockup generated and saved successfully with OpenRouter!",
            "filename": output_filename,
            "url": f"/static/{output_filename}"
        }

        
    except Exception as e:
           return {"error": str(e)}   

 # In main.py

class TranslateRequest(BaseModel):
    text_to_translate: str
    target_language: str
    context: str # e.g., "Instagram post", "Product description"

class QRCodeRequest(BaseModel):
    url: str
    size: int = 10  # QR code size (1-40)
    border: int = 4  # Border size

@app.post("/translate")
async def translate_text(request: TranslateRequest):
    """
    Translates and culturally adapts text for a specific language and context.
    """
    try:
        print(f"DEBUG: Translation request received:")
        print(f"  - Target language: {request.target_language}")
        print(f"  - Context: {request.context}")
        print(f"  - Text to translate: {request.text_to_translate[:100]}...")
        
        text_model = genai.GenerativeModel('gemini-2.5-flash-lite')
        prompt = f"""
        You are an expert translator specializing in marketing copy for artisanal goods.
        Translate the following text into {request.target_language}.
        The context of the text is a "{request.context}".
        Do not just translate literally. Culturally adapt the tone and phrasing to be compelling for an audience in that region.

        Text to translate:
        ---
        {request.text_to_translate}
        ---
        
        Your output should be ONLY the translated text.
        """
        
        print(f"DEBUG: Sending request to Gemini...")
        response = text_model.generate_content(prompt)
        print(f"DEBUG: Gemini response received: {response.text[:100]}...")
        
        result = {"translated_text": response.text}
        print(f"DEBUG: Returning result: {result}")
        return result
    except Exception as e:
        print(f"DEBUG: Translation error: {str(e)}")
        return {"error": str(e)}

@app.post("/generate-qr")
async def generate_qr_code(request: QRCodeRequest):
    """
    Generates a QR code for the given URL and returns the image file path.
    """
    try:
        # Create QR code instance
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_L,
            box_size=request.size,
            border=request.border,
        )
        
        # Add data to QR code
        qr.add_data(request.url)
        qr.make(fit=True)
        
        # Create QR code image
        qr_image = qr.make_image(fill_color="black", back_color="white")
        
        # Save QR code image
        qr_filename = f"qr_code_{hash(request.url) % 10000}.png"
        qr_filepath = os.path.join("static", qr_filename)
        os.makedirs("static", exist_ok=True)
        
        qr_image.save(qr_filepath)
        
        return {
            "status": "QR code generated successfully",
            "filename": qr_filename,
            "url": f"/static/{qr_filename}",
            "qr_data": request.url
        }
        
    except Exception as e:
        return {"error": str(e)}
    
@app.get("/story/{story_id}")
def get_story(story_id: str):
    """
    Fetches a specific story from Firestore. This is the endpoint the QR code will use.
    Only available if Firebase is configured.
    """
    if not firebase_enabled or not db:
        return {"error": "QR code story feature not available - Firebase not configured"}, 404
    
    try:
        doc_ref = db.collection(u'stories').document(story_id)
        doc = doc_ref.get()
        if doc.exists:
            return doc.to_dict()
        else:
            return {"error": "Story not found"}, 404
    except Exception as e:
        return {"error": f"An error occurred: {str(e)}"}, 500    