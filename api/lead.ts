// n8n webhook URL
const N8N_WEBHOOK_URL = 'https://bhavikp04.app.n8n.cloud/webhook/d32622c9-6916-47d9-91d4-87a73c2efde4';

// Helper function to set CORS headers and send JSON response
const sendResponse = (res, statusCode, data) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Set content type to JSON
  res.setHeader('Content-Type', 'application/json');
  
  // Send response with status and data
  return res.status(statusCode).json({
    success: statusCode >= 200 && statusCode < 300,
    ...data
  });
};

export default async function handler(req, res) {
  // Handle OPTIONS request (CORS preflight)
  if (req.method === 'OPTIONS') {
    return sendResponse(res, 200, { message: 'CORS preflight successful' });
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return sendResponse(res, 405, { 
      message: 'Method not allowed. Only POST requests are accepted.' 
    });
  }

  try {
    const { name, phone, service, message } = req.body;

    // Validate required fields
    if (!name || !phone || !service || !message) {
      return sendResponse(res, 400, {
        message: 'Missing required fields: name, phone, service, and message are required'
      });
    }

    // Forward the request to n8n webhook
    const n8nResponse = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify({ 
        name, 
        phone, 
        service, 
        message,
        timestamp: new Date().toISOString()
      }),
    });

    // Always get response as text first
    const textResponse = await n8nResponse.text();
    
    // Return success response with the n8n response
    return sendResponse(res, 200, {
      message: 'Form submitted successfully',
      n8nResponse: textResponse,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error in /api/lead:', error);
    return sendResponse(res, 500, { 
      message: error.message || 'Failed to process your request. Please try again later.' 
    });
  }
}
