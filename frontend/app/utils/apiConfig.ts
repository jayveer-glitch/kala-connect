// API configuration for different environments
console.log('🔍 Environment Debug:', {
  NODE_ENV: process.env.NODE_ENV,
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL
});

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 
  (process.env.NODE_ENV === 'production' 
    ? 'https://kalaconnect-backend.onrender.com'
    : 'http://localhost:8000');

console.log('🎯 Final API_BASE_URL:', API_BASE_URL);

export const apiConfig = {
  baseURL: API_BASE_URL,
  endpoints: {
    generateQR: `${API_BASE_URL}/generate-qr`,
    translate: `${API_BASE_URL}/translate`,
    mockup: `${API_BASE_URL}/generate-mockup`,
    analyze: `${API_BASE_URL}/analyze`,
    story: `${API_BASE_URL}/story`,
    generateStory: `${API_BASE_URL}/generate-story`,
    completeStory: `${API_BASE_URL}/complete-story`
  }
};

export default apiConfig;