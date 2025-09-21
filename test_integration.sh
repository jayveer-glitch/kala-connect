#!/bin/bash

echo "🧪 KalaConnect Integration Test Script"
echo "======================================"

echo ""
echo "Testing Backend Connectivity..."
curl -s http://localhost:8000 && echo "✅ Backend is running!" || echo "❌ Backend not responding"

echo ""
echo "Testing AI Integration..."
curl -s http://localhost:8000/test-ai && echo "" && echo "✅ AI integration working!" || echo "❌ AI integration failed"

echo ""
echo "Frontend should be running on: http://localhost:3000"
echo ""
echo "🔗 Test the complete flow:"
echo "1. Open http://localhost:3000/upload"
echo "2. Upload an image + select category"
echo "3. Answer AI questions"
echo "4. View generated content in gallery"
echo ""
echo "If everything works: YOU'RE READY FOR HACKATHON! 🚀"