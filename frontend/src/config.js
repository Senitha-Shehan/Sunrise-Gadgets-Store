const API_BASE = import.meta.env.VITE_API_URL || '';

export const API_URL = API_BASE.endsWith('/') ? API_BASE.slice(0, -1) : API_BASE;

// For Vercel Monorepo routing:
// In production, /api/products will be rewritten to the Backend.
// In development, you'll need to set VITE_API_URL=http://localhost:5000 in frontend/.env
