// API configuration for different environments
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? process.env.NEXT_PUBLIC_API_URL || 'https://kalaconnect-backend.onrender.com'
  : 'http://localhost:8000';

export const apiConfig = {
  baseURL: API_BASE_URL,
  endpoints: {
    generateQR: `${API_BASE_URL}/generate-qr`,
    translate: `${API_BASE_URL}/translate`,
    mockup: `${API_BASE_URL}/generate-mockup`,
    analyze: `${API_BASE_URL}/analyze`,
    story: `${API_BASE_URL}/story`
  }
};

export default apiConfig;