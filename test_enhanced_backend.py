import requests
import json

# Test the enhanced backend with new prompts
test_data = {
    "initial_description": "A beautiful handmade pottery bowl with intricate blue patterns, appears to be traditional ceramic work with floral motifs",
    "artisan_answers": [
        "I learned this craft from my grandmother who taught me traditional techniques passed down for generations",
        "This piece represents my cultural heritage - the patterns are inspired by my village's traditional designs",
        "Each piece takes about 3 days to complete, from shaping the clay to the final firing and glazing"
    ]
}

try:
    print("Testing enhanced backend prompts...")
    response = requests.post("http://localhost:8000/complete-story", json=test_data)
    print("Status Code:", response.status_code)
    
    if response.status_code == 200:
        result = response.json()
        print("\n=== Enhanced Backend Response Structure ===")
        if 'final_content' in result:
            content = result['final_content']
            for key in content.keys():
                print(f"✓ {key}: {type(content[key])}")
                if key == 'art_classification':
                    print(f"  - Art form: {content[key].get('art_form_name', 'N/A')}")
                    print(f"  - Region: {content[key].get('region_of_origin', 'N/A')}")
                elif key == 'pricing_guidance':
                    print(f"  - Price range: {content[key].get('suggested_price_range', 'N/A')}")
                    print(f"  - Market position: {content[key].get('market_positioning', 'N/A')}")
        
        print(f"\n=== Sample Instagram Post ===")
        print(result['final_content'].get('instagram_post', 'N/A')[:200] + "...")
        
    else:
        print("Error Response:", response.text)
        
except Exception as e:
    print(f"Connection Error: {e}")
    print("Make sure the backend server is running on port 8000")