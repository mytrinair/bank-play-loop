import { Hono } from 'hono';

const gemini = new Hono();

// Test endpoint to check environment variables
// This is the only '/test' route needed.
gemini.get('/test', (c) => {
  const apiKey = process.env.GEMINI_API_KEY;
  return c.json({
    message: 'Gemini API test endpoint',
    hasApiKey: !!apiKey,
    apiKeyLength: apiKey ? apiKey.length : 0,
    apiKeyStart: apiKey ? `${apiKey.substring(0, 10)}...` : 'Not found',
    envVars: Object.keys(process.env).filter(key => key.includes('GEMINI'))
  });
});

// The second duplicate gemini.get('/test') has been removed.

gemini.post('/', async (c) => {
  try {
    console.log('Gemini API route called');
    const { prompt } = await c.req.json();
    console.log('Received prompt:', prompt ? 'Present' : 'Missing');
    
    if (!prompt) {
      return c.json({ error: 'Prompt is required' }, 400);
    }

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    console.log('API Key status:', GEMINI_API_KEY ? 'Found' : 'Not found');
    
    if (!GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY not found in environment variables');
      return c.json({ error: 'API configuration error' }, 500);
    }

    const response = await fetch(
      // --- THIS IS THE FIX ---
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }]
        })
      }
    );

    if (!response.ok) {
      console.error('Gemini API error:', response.status, response.statusText);
      const errorText = await response.text();
      console.error('Gemini error response:', errorText); // This will show you the exact error from Google
      return c.json({ error: 'Failed to get response from AI helper' }, 500);
    }

    const data = await response.json();
    console.log('Gemini response data:', JSON.stringify(data, null, 2));
    
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || 
                         "I'm having trouble understanding right now. Can you try asking your question in a different way? 🤔";

    console.log('Generated text:', generatedText);
    return c.json({ response: generatedText });
  } catch (error) {
    console.error('Gemini API error:', error);
    return c.json({ 
      error: 'Something went wrong with the AI helper',
      response: "I'm having some trouble right now, but remember: think about needs vs wants, and what will help you reach your savings goal! You've got this! 🌟"
    }, 500);
  }
});

export default gemini;