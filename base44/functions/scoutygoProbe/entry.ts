import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const apiKey = Deno.env.get("SCOUTY_API_KEY");
    const baseUrl = Deno.env.get("SCOUTY_API_BASE_URL");

    if (!apiKey || !baseUrl) {
      return Response.json({
        error: 'Missing secrets',
        hasApiKey: !!apiKey,
        hasBaseUrl: !!baseUrl,
      }, { status: 500 });
    }

    // Probe several common endpoints to discover the API surface
    const endpoints = [
      '', '/',
      '/health', '/status',
      '/opportunities', '/signals', '/signals/recent',
      '/dashboard', '/stats', '/stats/dashboard',
      '/markets', '/categories',
      '/watchlist', '/entitlements',
    ];

    const results = {};
    for (const ep of endpoints) {
      try {
        const url = baseUrl + ep;
        const res = await fetch(url, {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'X-API-Key': apiKey,
            'Content-Type': 'application/json',
          },
          signal: AbortSignal.timeout(8000),
        });
        const text = await res.text();
        let body;
        try { body = JSON.parse(text); } catch { body = text.substring(0, 500); }
        results[ep || '(root)'] = {
          status: res.status,
          contentType: res.headers.get('content-type'),
          body: typeof body === 'string' ? body.substring(0, 500) : body,
        };
      } catch (err) {
        results[ep || '(root)'] = { error: err.message };
      }
    }

    return Response.json({ baseUrl, results });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});