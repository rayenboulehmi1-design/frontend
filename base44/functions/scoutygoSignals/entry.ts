import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    // Authenticate the user — dashboard data requires a logged-in user
    let user = null;
    try {
      user = await base44.auth.me();
    } catch {
      // Auth failed — return a clear 401 so the frontend can distinguish auth errors from API errors
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
      console.error('ScoutyGo API not configured: missing SCOUTY_API_KEY or SCOUTY_API_BASE_URL');
      return Response.json(
        { error: 'Server not configured', errorType: 'SERVER_NOT_CONFIGURED' },
        { status: 500 }
      );
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
      console.error(`ScoutyGo API returned ${oppRes.status} for opportunities`);
      return Response.json(
        { error: `ScoutyGo API returned ${oppRes.status}`, errorType: 'UPSTREAM_ERROR', upstreamStatus: oppRes.status },
        { status: 502 }
      );
    }

    const oppBody = await oppRes.json();
    const opportunities = oppBody.opportunities || [];
    const pagination = oppBody.pagination || null;

    let stats = null;
    if (statsRes.ok) {
      try { stats = await statsRes.json(); } catch {}
    }

    const signals = opportunities.map(mapOpportunityToSignal);

    return Response.json({ signals, pagination, stats });
  } catch (error) {
    console.error('scoutygoSignals error:', error.message);
    return Response.json(
      { error: error.message, errorType: 'INTERNAL_ERROR' },
      { status: 500 }
    );
  }
});

function mapOpportunityToSignal(opp) {
  const detectedAt = opp.detectedAt || opp.detectedTimestamp || (opp.createdAt ? new Date(opp.createdAt).getTime() : Date.now());
  const rawCountry = opp.country || (opp.location && opp.location.country);
  const rawCity = opp.city || (opp.location && opp.location.city);
  const country = (rawCountry && rawCountry !== 'Unknown' && rawCountry !== 'unknown') ? rawCountry : null;
  const city = (rawCity && rawCity !== 'Unknown' && rawCity !== 'unknown') ? rawCity : null;

  return {
    id: opp.id,
    title: opp.title || opp.company || 'Untitled Signal',
    company: opp.company || opp.title || null,
    category: mapCategory(opp),
    type: opp.type || opp.opportunityType || mapCategory(opp),
    location: formatLocation(opp),
    country,
    city,
    entity_name: opp.company || null,
    time_ago: formatTimeAgo(detectedAt),
    confidence: typeof opp.confidenceScore === 'number' ? opp.confidenceScore : (typeof opp.confidence === 'number' ? opp.confidence : null),
    summary: opp.summary ? opp.summary.substring(0, 280) : null,
    explanation: opp.explanation || opp.summary || opp.executiveSummary || null,
    signals: Array.isArray(opp.signals) ? opp.signals : (Array.isArray(opp.signalTags) ? opp.signalTags : []),
    timeline: opp.timeline || opp.estimatedTimeline || null,
    marketSize: opp.marketSize || null,
    created_date: new Date(detectedAt).toISOString(),
    detected_timestamp: detectedAt,
    sourceType: opp.sourceType || null,
    sourceUrl: opp.sourceUrl || null,
    verificationStatus: opp.verificationStatus || null,
    freshnessState: opp.freshnessState || null,
    corroborationState: opp.corroborationState || null,
    realEstateDetails: opp.realEstateDetails || null,
    isNew: false,
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
  const city = (rawCity && rawCity !== 'Unknown' && rawCountry !== 'unknown') ? rawCity : null;
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