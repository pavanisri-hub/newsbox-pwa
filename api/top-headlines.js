// api/top-headlines.js

// Simple JS aliases instead of importing TS types
/**
 * @typedef {import('@vercel/node').VercelRequest} VercelRequest
 * @typedef {import('@vercel/node').VercelResponse} VercelResponse
 */

/**
 * @param {VercelRequest} req
 * @param {VercelResponse} res
 */
export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', 'https://newsbox-pwa.vercel.app');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  const { country = 'in', category = 'general', lang = 'en', max = '20', q = '' } = req.query;

  const url = new URL('https://gnews.io/api/v4/top-headlines');
  url.searchParams.set('country', String(country));
  url.searchParams.set('category', String(category));
  url.searchParams.set('lang', String(lang));
  url.searchParams.set('max', String(max));
  if (q) url.searchParams.set('q', String(q));
  url.searchParams.set('apikey', process.env.GNEWS_API_KEY);

  try {
    const gnewsRes = await fetch(url.toString());
    const data = await gnewsRes.json();
    res.setHeader('Access-Control-Allow-Origin', 'https://newsbox-pwa.vercel.app');
    return res.status(gnewsRes.status).json(data);
  } catch (e) {
    res.setHeader('Access-Control-Allow-Origin', 'https://newsbox-pwa.vercel.app');
    return res.status(500).json({ message: 'Upstream error' });
  }
}
