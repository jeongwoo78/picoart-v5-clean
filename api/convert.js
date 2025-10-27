module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { image, style, apiToken } = req.body;

    if (!apiToken) {
      console.error('❌ API token missing');
      return res.status(400).json({ error: 'API token is required' });
    }

    if (!image || !style) {
      console.error('❌ Image or style missing');
      return res.status(400).json({ error: 'Image and style are required' });
    }

    console.log('=== PicoArt v5 Convert API ===');
    console.log('Style:', style);
    console.log('Image size:', image.length);

    const fallbackVersion = '8e579174a98cd09caca7e7a99fa2aaf4eaef16daf2003a3862c1af05c1c531c8';
    let modelVersion = fallbackVersion;

    try {
      console.log('Fetching latest model version...');
      const modelResponse = await fetch('https://api.replicate.com/v1/models/fofr/style-transfer', {
        headers: {
          'Authorization': `Token ${apiToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (modelResponse.ok) {
        const modelData = await modelResponse.json();
        if (modelData.latest_version?.id) {
          modelVersion = modelData.latest_version.id;
          console.log('✅ Using latest version:', modelVersion);
        }
      }
    } catch (error) {
      console.log('⚠️ Using fallback version');
    }

    const stylePrompts = {
      'vangogh': 'Van Gogh Starry Night style, post-impressionism, swirling brushstrokes, vibrant colors',
      'picasso': 'Picasso cubist style, geometric shapes, abstract, multiple perspectives',
      'monet': 'Monet impressionist style, water lilies, soft brushwork, light and color',
      'munch': 'Edvard Munch expressionist style, The Scream, emotional, bold colors',
      'klimt': 'Gustav Klimt art nouveau style, The Kiss, golden patterns, decorative',
      'watercolor': 'delicate watercolor painting style, soft edges, translucent colors'
    };

    const stylePrompt = stylePrompts[style] || stylePrompts['vangogh'];

    console.log('Creating prediction...');
    const response = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${apiToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        version: modelVersion,
        input: {
          image: image,
          prompt: stylePrompt,
          negative_prompt: 'blurry, low quality, distorted, ugly, deformed',
        }
      })
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('❌ Prediction error:', error);
      return res.status(response.status).json({ 
        error: 'Failed to create prediction',
        details: error 
      });
    }

    const prediction = await response.json();
    console.log('✅ Prediction created:', prediction.id);

    return res.status(200).json({ 
      predictionId: prediction.id,
      status: prediction.status
    });

  } catch (error) {
    console.error('❌ Server error:', error);
    return res.status(500).json({ 
      error: 'Internal server error', 
      message: error.message 
    });
  }
};
