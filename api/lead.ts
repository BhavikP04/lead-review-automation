// n8n webhook URL
const N8N_WEBHOOK_URL = 'https://bhavikp04.app.n8n.cloud/webhook/new-lead';

// Helper function to create a JSON response with CORS headers
const jsonResponse = (res, statusCode, data) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.statusCode = statusCode;
  return res.end(JSON.stringify(data));
};

// Main handler function
export default async function handler(req, res) {
  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    return jsonResponse(res, 200, { success: true, message: 'CORS preflight successful' });
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return jsonResponse(res, 405, {
      success: false,
      message: 'Method not allowed. Only POST requests are accepted.'
    });
  }

  try {
    // Parse the request body
    let body;
    try {
      body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const { name, phone, service, message } = body;

      // Validate required fields
      if (!name || !phone || !service || !message) {
        return jsonResponse(res, 400, {
          success: false,
          message: 'Missing required fields: name, phone, service, and message are required'
        });
      }

      // Forward the request to n8n webhook
      const response = await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          phone,
          service,
          message
        })
      });

      // Get the response text first
      const responseText = await response.text();
      let responseData;
      
      try {
        // Try to parse the response as JSON
        responseData = responseText ? JSON.parse(responseText) : {};
      } catch (e) {
        // If not JSON, use the raw text or a default message
        responseData = { message: responseText || 'Request processed by n8n' };
      }

      if (!response.ok) {
        throw new Error(responseData.message || `HTTP error! status: ${response.status}`);
      }

      // Return success response
      return jsonResponse(res, 200, {
        success: true,
        message: 'Form submitted successfully',
        data: responseData
      });
    } catch (parseError) {
      throw new Error('Invalid request body. Please provide valid JSON data.');
    }
  } catch (error) {
    console.error('API Error:', error);
    return jsonResponse(res, 500, {
      success: false,
      message: error.message || 'Failed to process your request. Please try again later.'
    });
  }
}
