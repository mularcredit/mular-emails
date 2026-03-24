import { Router } from 'express';
const router = Router();

const brevoReq = async (path, init={}) => {
  const key = process.env.VITE_BREVO_API_KEY;
  return fetch(`https://api.brevo.com/v3${path}`, {
    ...init,
    headers: {
      ...init.headers,
      'api-key': key,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  });
};

router.use(async (req, res) => {
  try {
    const urlPath = req.url;
    const init = { method: req.method };
    if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
      init.body = JSON.stringify(req.body);
    }
    const r = await brevoReq(urlPath, init);
    const data = await r.json();
    res.status(r.status).json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
