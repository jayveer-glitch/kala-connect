import requests
import base64
import os

def test_backend_mockup_generation():
    """Test the backend mockup generation endpoint"""
    
    # Test if backend is running
    try:
        response = requests.get('http://localhost:8000')
        print("✅ Backend server is running")
    except requests.exceptions.ConnectionError:
        print("❌ Backend server is not running! Please start it with: python main.py")
        return
    
    # Test image file (use a simple test image)
    test_image_path = "static/generated_or_pottery.jpeg"
    
    if not os.path.exists(test_image_path):
        print(f"❌ Test image not found at {test_image_path}")
        return
    
    # Test the mockup generation endpoint
    try:
        with open(test_image_path, 'rb') as image_file:
            files = {
                'image': ('test.jpg', image_file, 'image/jpeg')
            }
            data = {
                'context': 'Professional product shot on a marble background with soft lighting for a luxury skincare brand'
            }
            
            print("🔄 Testing mockup generation...")
            response = requests.post(
                'http://localhost:8000/generate-mockup',
                files=files,
                data=data,
                timeout=60  # OpenRouter can take time
            )
            
            if response.status_code == 200:
                result = response.json()
                print("✅ Mockup generation successful!")
                print(f"Response: {result}")
                
                if 'url' in result:
                    print(f"✅ Generated image URL: http://localhost:8000{result['url']}")
                else:
                    print("❌ No 'url' field in response")
            else:
                print(f"❌ Request failed with status {response.status_code}")
                print(f"Response: {response.text}")
                
    except requests.exceptions.Timeout:
        print("❌ Request timed out - OpenRouter API might be slow")
    except Exception as e:
        print(f"❌ Error testing backend: {e}")

if __name__ == "__main__":
    test_backend_mockup_generation()