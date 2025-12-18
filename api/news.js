// api/news.js

export default async function handler(req, res) {
  const { country = 'in', category = 'general', lang = 'en', max = '20', q = '' } = req.query || {};

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
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(gnewsRes.status).json(data);
  } catch (e) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(500).json({ message: 'Upstream error' });
  }
}
