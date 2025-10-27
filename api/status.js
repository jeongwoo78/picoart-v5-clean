module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { predictionId, apiToken } = req.query;

    if (!predictionId || !apiToken) {
      console.error('❌ Missing parameters');
      return res.status(400).json({ 
        error: 'Required parameters missing',
        details: 'Both predictionId and apiToken are required'
      });
    }

    console.log('=== PicoArt v5 Status API ===');
    console.log('Checking:', predictionId);

    const response = await fetch(`https://api.replicate.com/v1/predictions/${predictionId}`, {
      headers: {
        'Authorization': `Token ${apiToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('❌ API error:', error);
      return res.status(response.status).json({ 
        error: 'Failed to check prediction status',
        details: error 
      });
    }

    const prediction = await response.json();
    console.log('Status:', prediction.status);
    
    if (prediction.status === 'succeeded') {
      console.log('✅ Success!');
    } else if (prediction.status === 'failed') {
      console.log('❌ Failed:', prediction.error);
    }

    return res.status(200).json({
      status: prediction.status,
      output: prediction.output,
      error: prediction.error
    });

  } catch (error) {
    console.error('❌ Server error:', error);
    return res.status(500).json({ 
      error: 'Internal server error', 
      message: error.message 
    });
  }
};
