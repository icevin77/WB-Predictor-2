// Serverless proxy for the prediction request.
// All credentials and model settings come from Vercel environment variables,
// so nothing sensitive is shipped to the browser.
//
//   MODEL_API_URL        messages endpoint of the provider
//   MODEL_API_KEY        provider API key
//   MODEL_NAME           model identifier
//   MODEL_VERSION        optional API version value
//   MODEL_VERSION_HEADER optional header name carrying MODEL_VERSION
//   MAX_TOKENS           optional, default 12000

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: { message: 'Method not allowed' } });
  }

  const url = process.env.MODEL_API_URL;
  const key = process.env.MODEL_API_KEY;
  const model = process.env.MODEL_NAME;
  if (!url || !key || !model) {
    return res.status(500).json({ error: { message: 'Server is missing MODEL_API_URL, MODEL_API_KEY or MODEL_NAME' } });
  }

  const { system, messages } = req.body || {};
  if (!Array.isArray(messages) || !messages.length) {
    return res.status(400).json({ error: { message: 'messages is required' } });
  }

  const headers = {
    'Content-Type': 'application/json',
    'x-api-key': key,
    'authorization': 'Bearer ' + key
  };
  if (process.env.MODEL_VERSION) {
    headers[process.env.MODEL_VERSION_HEADER || 'x-api-version'] = process.env.MODEL_VERSION;
  }

  try {
    const upstream = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model,
        max_tokens: parseInt(process.env.MAX_TOKENS || '12000', 10),
        system,
        messages
      })
    });
    const data = await upstream.json();
    return res.status(upstream.status).json(data);
  } catch (e) {
    return res.status(502).json({ error: { message: 'Upstream request failed: ' + e.message } });
  }
}
