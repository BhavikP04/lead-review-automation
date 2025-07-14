// n8n webhook URL
const N8N_WEBHOOK_URL = 'https://bhavikp04.app.n8n.cloud/webhook/d32622c9-6916-47d9-91d4-87a73c2efde4';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Handle OPTIONS request (CORS preflight)
  if (req.method === 'OPTIONS') {
    return res.status(200).json({ success: true });
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      message: 'Method not allowed' 
    });
  }

  try {
    const { name, phone, service, message } = req.body;

    // Validate required fields
    if (!name || !phone || !service || !message) {
      return res.status(400).json({
        success: false,
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
        message 
      }),
    });

    // Always get response as text first
    const textResponse = await n8nResponse.text();
    
    // Return success response with the n8n response
    return res.status(200).json({
      success: true,
      message: 'Form submitted successfully',
      n8nResponse: textResponse
    });

  } catch (error) {
    console.error('Error in /api/lead:', error);
    return res.status(500).json({ 
      success: false, 
      message: error.message || 'Failed to process your request' 
    });
  }
}
