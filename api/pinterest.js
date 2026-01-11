// Vercel API route for Pinterest video extraction
// This is a simplified version that works with Vercel's serverless functions

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  try {
    // Simple URL validation for Pinterest
    const pinterestRegex = /pinterest\.[^/]+\/pin\//i;
    if (!pinterestRegex.test(url)) {
      return res.status(400).json({ 
        error: 'Invalid Pinterest URL', 
        disclaimer: 'This tool only works with public Pinterest content' 
      });
    }

    // Return a mock response indicating this is a Vercel-compatible version
    // In a real implementation, you would extract the video URL from Pinterest
    return res.status(200).json({
      success: true,
      data: {
        sourceUrl: url,
        videoUrl: '', // Would be populated with actual video URL in real implementation
        qualities: [],
        title: 'Video Title',
        author: 'Author Name'
      },
      disclaimer: 'This is a Vercel-compatible version. Actual video extraction requires server capabilities not available in all environments.'
    });
  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      disclaimer: 'An unexpected error occurred during processing.'
    });
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};