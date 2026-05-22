export default {
  server: {
    proxy: {
      "/api": {
        target: "https://your-backend.onrender.com",
        changeOrigin: true,   // With this, our frontend will appear to come from the same origin as the backend, avoiding CORS issues.
        secure: false,      // If your backend uses self-signed certificates, set this to false.
      },
    },
  },
};