import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

/**
 * Generic Replit API proxy.
 * Forwards authenticated GET requests to the ScoutyGo Replit Intelligence Engine.
 * The frontend calls this with { path, params } and receives raw upstream data.
 * Replit remains the single source of truth — no business logic here.
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    let user = null;
    try {
      user = await base44.auth.me();
    } catch {
      return Response.json(
        { error: 'Authentication required', errorType: 'AUTH_REQUIRED' },
        { status: 401 }
      );
    }
    if (!user) {
      return Response.json(
        { error: 'Authentication required', errorType: 'AUTH_REQUIRED' },
        { status: 401 }
      );
    }

    const apiKey = Deno.env.get("SCOUTY_API_KEY");
    const baseUrl = Deno.env.get("SCOUTY_API_BASE_URL");
    if (!apiKey || !baseUrl) {
      return Response.json(
        { error: 'Server not configured', errorType: 'SERVER_NOT_CONFIGURED' },
        { status: 500 }
      );
    }

    let path = null;
    let params = {};
    try {
      const body = await req.json();
      path = body.path;
      params = body.params || {};
    } catch {
      return Response.json(
        { error: 'Invalid request body', errorType: 'INVALID_BODY' },
        { status: 400 }
      );
    }

    if (!path || typeof path !== 'string' || !path.startsWith('/')) {
      return Response.json(
        { error: 'Invalid path — must start with /', errorType: 'INVALID_PATH' },
        { status: 400 }
      );
    }

    // Prevent path traversal
    if (path.includes('..')) {
      return Response.json(
        { error: 'Invalid path', errorType: 'INVALID_PATH' },
        { status: 400 }
      );
    }

    const queryString = new URLSearchParams(
      Object.entries(params)
        .filter(([, v]) => v != null && v !== '')
        .map(([k, v]) => [k, String(v)])
    ).toString();

    const url = `${baseUrl}${path}${queryString ? `?${queryString}` : ''}`;

    const headers = {
      'Authorization': `Bearer ${apiKey}`,
      'X-API-Key': apiKey,
      'Content-Type': 'application/json',
    };

    const response = await fetch(url, {
      headers,
      signal: AbortSignal.timeout(15000),
    });

    if (!response.ok) {
      let upstreamBody = null;
      try { upstreamBody = await response.text(); } catch {}
      return Response.json(
        {
          error: `Upstream returned ${response.status}`,
          errorType: 'UPSTREAM_ERROR',
          upstreamStatus: response.status,
          upstreamBody: upstreamBody ? upstreamBody.substring(0, 500) : null,
        },
        { status: response.status === 404 ? 404 : 502 }
      );
    }

    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    console.error('scoutygoApi error:', error.message);
    return Response.json(
      { error: error.message, errorType: 'INTERNAL_ERROR' },
      { status: 500 }
    );
  }
});