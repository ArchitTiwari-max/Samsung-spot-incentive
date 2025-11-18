export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  (process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:3001/api');

export const config = {
  apiUrl: API_BASE_URL,
  isDevelopment: process.env.NODE_ENV !== 'production',
  isProduction: process.env.NODE_ENV === 'production',
  cloudinary: {
    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || '',
    uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || '',
    folder: (process.env.NEXT_PUBLIC_CLOUDINARY_FOLDER || 'proctoring').replace(/\/$/, ''),
    signed: String(process.env.NEXT_PUBLIC_CLOUDINARY_SIGNED || '').toLowerCase() === 'true',
    signatureUrl:
      process.env.NEXT_PUBLIC_CLOUDINARY_SIGNATURE_URL || '/api/cloudinary-signature',
  },
};
