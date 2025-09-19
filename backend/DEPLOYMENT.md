# KalaConnect Backend Deployment Guide

## Deploying on Render

### 1. Backend Deployment
1. Push this `backend` folder to a GitHub repository
2. Connect to Render and create a **Web Service**
3. Configure the service:
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - **Environment**: Python 3.11

### 2. Environment Variables on Render

Set these environment variables in your Render dashboard:

- `GOOGLE_API_KEY`: Your Google Gemini API key
- `OPENROUTER_API_KEY`: Your OpenRouter API key

**Firebase Service Account Variables** (from your serviceAccountKey.json):
- `FIREBASE_TYPE`: service_account
- `FIREBASE_PROJECT_ID`: Your project ID from the JSON file
- `FIREBASE_PRIVATE_KEY_ID`: The private_key_id from the JSON file
- `FIREBASE_PRIVATE_KEY`: The private_key from the JSON file (keep the \n characters)
- `FIREBASE_CLIENT_EMAIL`: The client_email from the JSON file
- `FIREBASE_CLIENT_ID`: The client_id from the JSON file
- `FIREBASE_AUTH_URI`: https://accounts.google.com/o/oauth2/auth
- `FIREBASE_TOKEN_URI`: https://oauth2.googleapis.com/token
- `FIREBASE_AUTH_PROVIDER_X509_CERT_URL`: https://www.googleapis.com/oauth2/v1/certs
- `FIREBASE_CLIENT_X509_CERT_URL`: The client_x509_cert_url from the JSON file

### 3. How to Get Firebase Environment Variables

From your `serviceAccountKey.json` file, extract these values:

### 4. Frontend Integration
Your Next.js frontend should make API calls to:
```
https://your-backend-app.onrender.com
```

## API Endpoints Available

- `POST /generate-story` - Upload image and category, get AI questions
- `POST /complete-story` - Submit answers, get final marketing content
- `POST /get-pricing` - Get pricing suggestions
- `POST /generate-mockup` - Generate product mockups
- `POST /translate` - Translate content to other languages  
- `GET /story/{story_id}` - Retrieve saved story (for QR codes)

## CORS Configuration
The backend now includes CORS middleware to accept requests from your Next.js frontend.
In production, update the `allow_origins` to your specific frontend domain.