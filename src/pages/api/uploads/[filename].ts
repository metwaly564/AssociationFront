import { NextApiRequest, NextApiResponse } from 'next';
import fetch from 'node-fetch';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { filename } = req.query;

    if (!filename || typeof filename !== 'string') {
      return res.status(400).json({ error: 'Invalid filename' });
    }

    // Security check - prevent directory traversal
    if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
      return res.status(400).json({ error: 'Invalid filename' });
    }

    // Proxy request to CMS
    const cmsUrl = `https://associationback.onrender.com/api/uploads/${filename}`;
    console.log('Proxying file request to:', cmsUrl);

    const response = await fetch(cmsUrl);

    if (!response.ok) {
      console.error('CMS response error:', response.status, response.statusText);
      return res.status(response.status).json({ error: 'File not found' });
    }

    // Get content type from CMS response
    const contentType = response.headers.get('content-type') || 'application/octet-stream';

    // Stream the file content
    const buffer = await response.arrayBuffer();

    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'public, max-age=31536000'); // Cache for 1 year
    res.setHeader('Access-Control-Allow-Origin', '*');

    res.send(Buffer.from(buffer));

  } catch (error: any) {
    console.error('Error proxying uploaded file:', error);
    res.status(500).json({
      error: 'Error serving file',
      details: error.message
    });
  }
}