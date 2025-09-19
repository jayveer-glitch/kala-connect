import json

def extract_firebase_env_vars(json_file_path):
    """
    Extracts Firebase credentials from serviceAccountKey.json 
    and formats them as environment variables for Render deployment.
    """
    try:
        with open(json_file_path, 'r') as f:
            creds = json.load(f)
        
        print("# Add these environment variables to your Render dashboard:")
        print(f'FIREBASE_TYPE="{creds.get("type", "service_account")}"')
        print(f'FIREBASE_PROJECT_ID="{creds.get("project_id")}"')
        print(f'FIREBASE_PRIVATE_KEY_ID="{creds.get("private_key_id")}"')
        print(f'FIREBASE_PRIVATE_KEY="{creds.get("private_key")}"')
        print(f'FIREBASE_CLIENT_EMAIL="{creds.get("client_email")}"')
        print(f'FIREBASE_CLIENT_ID="{creds.get("client_id")}"')
        print(f'FIREBASE_AUTH_URI="{creds.get("auth_uri")}"')
        print(f'FIREBASE_TOKEN_URI="{creds.get("token_uri")}"')
        print(f'FIREBASE_AUTH_PROVIDER_X509_CERT_URL="{creds.get("auth_provider_x509_cert_url")}"')
        print(f'FIREBASE_CLIENT_X509_CERT_URL="{creds.get("client_x509_cert_url")}"')
        
    except FileNotFoundError:
        print("Error: serviceAccountKey.json not found!")
    except json.JSONDecodeError:
        print("Error: Invalid JSON format in serviceAccountKey.json!")

if __name__ == "__main__":
    extract_firebase_env_vars("serviceAccountKey.json")