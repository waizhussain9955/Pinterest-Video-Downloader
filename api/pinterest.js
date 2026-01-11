// Vercel API route for Pinterest video extraction
// This version works with Vercel's serverless functions

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

    // Attempt to extract video URL from Pinterest (simplified approach for Vercel compatibility)
    try {
      // Fetch the Pinterest page content
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate',
          'Connection': 'keep-alive',
          'Upgrade-Insecure-Requests': '1',
        },
        redirect: 'follow'
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch Pinterest page: ${response.status}`);
      }

      const html = await response.text();

      // Look for video URLs in the HTML
      const videoPatterns = [
        /"(https?:\/\/[^"]*\.mp4[^"]*)"/g,
        /property="og:video" content="([^"]*\.mp4[^"]*)"/g,
        /<source[^>]+src="([^"]*\.mp4[^"]*)"[^>]*>/g
      ];

      let videoUrl = null;
      for (const pattern of videoPatterns) {
        const matches = html.match(pattern);
        if (matches && matches.length > 0) {
          // Clean up the URL
          let match = matches[0];
          if (match.includes('property="og:video"')) {
            match = match.split('content="')[1]?.split('"')[0];
          } else if (match.includes('<source')) {
            match = match.split('src="')[1]?.split('"')[0];
          } else {
            match = match.replace(/^["']|["']$/g, '');
          }
          
          if (match && match.startsWith('http') && match.includes('.mp4')) {
            videoUrl = decodeURIComponent(match.replace(/\\/g, ''));
            break;
          }
        }
      }

      if (videoUrl) {
        return res.status(200).json({
          success: true,
          data: {
            sourceUrl: url,
            videoUrl: videoUrl,
            qualities: [{ url: videoUrl, qualityLabel: 'Original' }]
          },
          disclaimer: 'Direct video URL extracted. Download responsibly.'
        });
      } else {
        // If we can't extract a direct URL, return an informative response
        return res.status(200).json({
          success: false,
          error: 'Could not extract direct video URL. Pinterest may be blocking automated access.',
          data: {
            sourceUrl: url,
            note: 'Try accessing the Pinterest URL directly in a browser'
          },
          disclaimer: 'Pinterest has strong anti-bot measures. Direct extraction may not work for all videos.'
        });
      }
    } catch (fetchError) {
      console.error('Fetch error:', fetchError);
      return res.status(500).json({
        success: false,
        error: 'Failed to access Pinterest URL. This may be due to Pinterest\'s anti-scraping measures.',
        disclaimer: 'Pinterest blocks serverless functions from accessing video content directly.'
      });
    }
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