# 🚀 KalaConnect - Deployment Guide

## 📋 CRITICAL: MVP Ready - Firebase Optional!

**Good News**: The MVP works perfectly WITHOUT database! Firebase is only needed for QR code story sharing feature, which we can add later.

## � IMPORTANT: URL Configuration Fixed

**Problem Solved**: The application was using hardcoded `localhost:8000` URLs which wouldn't work after deployment. This has been fixed with environment-based configuration.

### Updated Files for Deployment:
- ✅ `frontend/app/utils/apiConfig.ts` - New API configuration system
- ✅ `frontend/app/gallery/page.tsx` - QR generation now uses environment URLs
- ✅ `frontend/app/mockup/page.tsx` - Mockup generation now uses environment URLs  
- ✅ `backend/main.py` - CORS updated for production domains
- ✅ Environment files updated with deployment instructions

## �🛠 Backend Deployment (Render)

### 1. Required Environment Variables (MANDATORY)
```
GOOGLE_API_KEY=your_gemini_api_key_here
OPENROUTER_API_KEY=your_openrouter_api_key_here
FRONTEND_URL=https://your-frontend-app.onrender.com
```

### 2. Backend Setup Commands
```bash
cd backend
pip install -r requirements.txt
python main.py  # Runs on port 8000
```

### 3. Render Configuration
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
- **Python Version**: 3.9+

## 🎨 Frontend Deployment (Vercel/Netlify)

### 1. Required Environment Variables
```
NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com
```

**IMPORTANT**: Replace `your-backend-url` with your actual Render backend URL

### 2. Frontend Setup Commands
```bash
cd frontend
npm install
npm run build
npm start  # Runs on port 3000
```

### 3. Vercel Configuration
- **Build Command**: `npm run build`
- **Install Command**: `npm install`
- **Output Directory**: `.next`

## 🔄 Deployment Order (IMPORTANT)

1. **Deploy Backend First** → Get backend URL
2. **Set Frontend Environment Variable** → `NEXT_PUBLIC_API_URL=https://your-backend.onrender.com`
3. **Deploy Frontend** → Get frontend URL  
4. **Update Backend Environment** → `FRONTEND_URL=https://your-frontend.onrender.com`
5. **Redeploy Backend** → For CORS to work correctly

## 🔧 API Keys Needed

### Google Gemini API
1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Create new API key
3. Set as `GOOGLE_API_KEY`

### OpenRouter API
1. Go to [OpenRouter](https://openrouter.ai/)
2. Create account and get API key
3. Set as `OPENROUTER_API_KEY`

## 🚦 Testing the Deployment

### Health Check Endpoints
- Backend: `https://your-backend.render.com/` (should return status)
- Backend AI Test: `https://your-backend.render.com/test-ai`

### Full User Flow Test
1. Upload image → Should analyze with AI
2. Answer questions → Should generate story
3. View gallery → Should show generated content

## ⚠️ Common Issues & Solutions

### CORS Issues
- Backend automatically allows all origins for development
- Update CORS settings in `main.py` for production

### Environment Variables
- Double-check API keys are correctly set
- Verify URL variables don't have trailing slashes

### File Upload Issues
- Images are processed in-memory, no file storage needed
- Max upload size handled by FastAPI

## 🎯 What Works in MVP
✅ Image upload and analysis  
✅ AI story generation  
✅ Marketing content creation  
✅ Gallery display  
✅ Mockup generation  
✅ Translation service  

## 🔮 Optional Features (Can Add Later)
⏳ QR code story sharing (requires Firebase)  
⏳ User authentication  
⏳ Persistent storage  

## 📞 Support
If deployment issues occur:
1. Check logs for specific error messages
2. Verify all environment variables are set
3. Test API endpoints individually
4. Check CORS if frontend can't reach backend

**The app is ready for deployment and will work great for the hackathon demo!** 🚀