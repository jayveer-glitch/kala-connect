from fastapi import FastAPI, File, UploadFile, Form
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
from prompts import MASTER_STORYTELLER_PROMPT
from prompts import MASTER_MOCKUP_PROMPT


class StoryData(BaseModel):
    initial_description: str
    artisan_answers: List[str]

class MockupRequest(BaseModel):
    context: str

# Load environment variables from .env file
load_dotenv()

# Initialize Firebase using environment variables
try:
    # Try to use environment variables first (for production deployment)
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
    if all(firebase_credentials[key] for key in ["project_id", "private_key", "client_email"]):
        cred = credentials.Certificate(firebase_credentials)
        print("Using Firebase credentials from environment variables")
    else:
        # Fallback to local file for development
        cred = credentials.Certificate("serviceAccountKey.json")
        print("Using Firebase credentials from local file")
        
except Exception as e:
    print(f"Error loading Firebase credentials: {e}")
    # Fallback to local file
    cred = credentials.Certificate("serviceAccountKey.json")

firebase_admin.initialize_app(cred)
db = firestore.client()


app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with your frontend domain
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
        # ... (read the image contents as before)
        contents = await image.read()
        pil_image = Image.open(io.BytesIO(contents))

        # NEW: Inject the category into the prompt
        vision_prompt = [
            f"""
            Analyze this image of a handmade craft, which the artisan has identified as being in the '{category}' category.
            - First, briefly describe the object you see in a single sentence.
            - Second, based on what you see and the category, generate a list of three simple, warm, and open-ended questions...
            - Format the output as JSON...
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

        # Save the data to a 'stories' collection in Firestore
        doc_ref = db.collection(u'stories').add(story_data)
        story_id = doc_ref[1].id # Get the auto-generated ID

        # Return the content AND the new ID for the QR code
        return {"story_id": story_id, "final_content": story_data}

        

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
        
        # 1. Read and encode the uploaded image
        contents = await image.read()
        image_base64 = base64.b64encode(contents).decode("utf-8")
        image_url = f"data:image/jpeg;base64,{image_base64}"

        # 2. Craft the generation prompt
        prompt = f"""
        Take the user-provided image of an artisanal craft. 
        Create a new photorealistic image placing that craft in a new scene: '{context}'.
        The original background must be replaced.
        """

        # 3. Make the API call exactly as requested
        response = requests.post(
            url="https://openrouter.ai/api/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {openrouter_key}",
                "Content-Type": "application/json",
            },
            data=json.dumps({
                "model": "google/gemini-2.5-flash-image-preview", # Using a confirmed model name
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
        response_json = response.json()
        message = response_json["choices"][0]["message"]
        base64_url = None
        
        if "images" in message and message["images"]:
            base64_url = message["images"][0]["image_url"]["url"]

        if not base64_url:
            return {"error": "API response was successful, but no image data was found in the 'images' key."}

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

@app.post("/translate")
async def translate_text(request: TranslateRequest):
    """
    Translates and culturally adapts text for a specific language and context.
    """
    try:
        text_model = genai.GenerativeModel('gemini-pro')
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
        response = text_model.generate_content(prompt)
        return {"translated_text": response.text}
    except Exception as e:
        return {"error": str(e)}   
    
@app.get("/story/{story_id}")
def get_story(story_id: str):
    """
    Fetches a specific story from Firestore. This is the endpoint the QR code will use.
    """
    try:
        doc_ref = db.collection(u'stories').document(story_id)
        doc = doc_ref.get()
        if doc.exists:
            return doc.to_dict()
        else:
            return {"error": "Story not found"}, 404
    except Exception as e:
        return {"error": f"An error occurred: {str(e)}"}, 500    