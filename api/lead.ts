import type { VercelRequest, VercelResponse } from '@vercel/node';

const N8N_WEBHOOK_URL = 'https://bhavikp04.app.n8n.cloud/webhook/new-lead';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
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

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Return success response
    return res.status(200).json({
      success: true,
      message: 'Form submitted successfully'
    });

  } catch (error) {
    console.error('Error forwarding to n8n webhook:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to submit form. Please try again later.'
    });
  }
}
