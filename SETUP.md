# Walmart TrustLens Setup Guide

## Required Environment Variables

To enable full AI functionality, you need to configure the following environment variables:

### 1. Google Gemini API Key

1. Go to [Google AI Studio](https://ai.google.dev/gemini-api/docs)
2. Create an account or sign in
3. Generate a new API key
4. Open `.env.local` file in the project root
5. Replace `your_gemini_api_key_here` with your actual API key:

```bash
GEMINI_API_KEY=your_actual_api_key_here
```

### 2. Restart Development Server

After updating the environment variables:

```bash
npm run dev
```

## Fallback Mode

If the API key is not configured, the application will run in fallback mode with:
- Basic predefined responses
- Limited AI functionality
- Shopping assistance with static recommendations

The application will continue to work but with reduced AI capabilities.

## Troubleshooting

### "Status 400" Error
- Check that your API key is properly set in `.env.local`
- Ensure the API key is valid and not expired
- Restart the development server after changes

### AI Responses Not Working
- Verify your Gemini API key has sufficient quota
- Check the browser console for detailed error messages
- Ensure you have an active internet connection

## Features Available

With proper configuration:
- ✅ Full AI-powered chat assistance
- ✅ Product recommendations
- ✅ Price comparisons
- ✅ Sustainability advice
- ✅ Smart shopping guidance

In fallback mode:
- ✅ Basic shopping assistance
- ✅ Predefined helpful responses
- ❌ Limited personalized recommendations
- ❌ Reduced AI capabilities
