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

    const styleImages = {
      'vangogh': 'https://replicate.delivery/pbxt/JvhVGJtyLKKBpFQZKzLBHUGxTsKh73t1YJJyXFRnqVhX6xvh/starry_night.jpg',
      'picasso': 'https://replicate.delivery/pbxt/JvhXwn0sxxsUP4DKgY9lZFKLd3EGvYmMOKCL9chcb3VCFBTH/guernica.jpg',
      'monet': 'https://replicate.delivery/pbxt/JvhXqh5gYJPPiQPLEiKgXqGXvFYLl6LJvxOULJJnCRwY3xvh/water_lilies.jpg',
      'munch': 'https://replicate.delivery/pbxt/JvhXqiFLTu3s0tN5c7bOhKzUCxMLUcS7OPrUpq6hXC1gFBTH/the_scream.jpg',
      'klimt': 'https://replicate.delivery/pbxt/JvhXqkwLYGhN5YlY8OqQCKYsUoLHMvJqKdXuqfRjwUZm6xvh/the_kiss.jpg',
      'watercolor': 'https://replicate.delivery/pbxt/JvhXqnXzWJBnLGJzHLmUGdKySUGLjtvCswzLkQwsYwXfFBTH/watercolor.jpg'
    };

    const styleImage = styleImages[style] || styleImages['vangogh'];

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
          style_image: styleImage,
          prompt: `${style} style artwork, high quality, masterpiece`,
          negative_prompt: 'blurry, low quality, distorted, ugly',
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
