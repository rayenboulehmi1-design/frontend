import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const apiKey = Deno.env.get("SCOUTY_API_KEY");
    const baseUrl = Deno.env.get("SCOUTY_API_BASE_URL");
    if (!apiKey || !baseUrl) {
      return Response.json({ error: 'Server not configured' }, { status: 500 });
    }

    let limit = 200;
    let page = 1;
    try {
      const body = await req.json();
      if (body.limit) limit = Math.min(parseInt(body.limit) || 200, 500);
      if (body.page) page = parseInt(body.page) || 1;
    } catch {}

    const headers = {
      'Authorization': `Bearer ${apiKey}`,
      'X-API-Key': apiKey,
      'Content-Type': 'application/json',
    };

    const oppUrl = `${baseUrl}/opportunities?limit=${limit}&page=${page}`;
    const statsUrl = `${baseUrl}/stats`;

    const [oppRes, statsRes] = await Promise.all([
      fetch(oppUrl, { headers, signal: AbortSignal.timeout(15000) }),
      fetch(statsUrl, { headers, signal: AbortSignal.timeout(15000) }),
    ]);

    if (!oppRes.ok) {
      return Response.json({ error: `ScoutyGo API returned ${oppRes.status}` }, { status: 502 });
    }

    const oppBody = await oppRes.json();
    const opportunities = oppBody.opportunities || [];
    const pagination = oppBody.pagination || null;

    let stats = null;
    if (statsRes.ok) {
      stats = await statsRes.json();
    }

    const signals = opportunities.map(mapOpportunityToSignal);

    return Response.json({ signals, pagination, stats });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});

function mapOpportunityToSignal(opp) {
  const detectedAt = opp.detectedAt || (opp.createdAt ? new Date(opp.createdAt).getTime() : Date.now());
  return {
    id: opp.id,
    title: opp.title || 'Untitled Signal',
    category: mapCategory(opp),
    location: formatLocation(opp),
    entity_name: opp.company || null,
    time_ago: formatTimeAgo(detectedAt),
    confidence: typeof opp.confidenceScore === 'number' ? opp.confidenceScore : null,
    summary: opp.summary ? opp.summary.substring(0, 280) : null,
    created_date: new Date(detectedAt).toISOString(),
  };
}

function mapCategory(opp) {
  if (opp.realEstate) return 'Real Estate';
  const text = `${opp.category || ''} ${opp.opportunityType || ''} ${opp.subcategory || ''}`.toLowerCase();
  if (text.includes('real estate') || text.includes('property') || text.includes('land deal')) return 'Real Estate';
  if (text.includes('investment') || text.includes('funding') || text.includes('venture') || text.includes('capital') || text.includes('equity') || text.includes('invest')) return 'Investment';
  return 'Business';
}

function formatLocation(opp) {
  const rawCity = opp.city || (opp.location && opp.location.city);
  const rawCountry = opp.country || (opp.location && opp.location.country);
  const city = (rawCity && rawCity !== 'Unknown' && rawCity !== 'unknown') ? rawCity : null;
  const country = (rawCountry && rawCountry !== 'Unknown' && rawCountry !== 'unknown') ? rawCountry : null;
  if (city && country) return `${city}, ${country}`;
  if (country) return country;
  if (city) return city;
  return 'Global';
}

function formatTimeAgo(timestamp) {
  if (!timestamp) return 'recently';
  const now = Date.now();
  const then = typeof timestamp === 'number' ? timestamp : new Date(timestamp).getTime();
  const diff = Math.max(0, now - then);
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (mins > 0) return `${mins}m ago`;
  return 'just now';
}