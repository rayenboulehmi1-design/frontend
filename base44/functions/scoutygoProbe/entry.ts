import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

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
    const headers = { 'Authorization': `Bearer ${apiKey}`, 'X-API-Key': apiKey };

    // Get one opportunity, extract only mapping-relevant scalar fields
    const oppRes = await fetch(baseUrl + '/opportunities?limit=1', { headers, signal: AbortSignal.timeout(8000) });
    let oppBody;
    try {
      oppBody = await oppRes.json();
    } catch {
      const oppText = await oppRes.text().catch(() => '');
      return Response.json({
        error: `Opportunities endpoint returned non-JSON (HTTP ${oppRes.status})`,
        oppStatus: oppRes.status,
        oppBody: oppText ? oppText.substring(0, 500) : null,
      });
    }
    const o = oppBody.opportunities?.[0] || {};
    const opp = {
      id: o.id, title: o.title, summary: o.summary?.substring(0, 200),
      category: o.category, subcategory: o.subcategory, opportunityType: o.opportunityType,
      company: o.company, country: o.country, city: o.city, location: o.location,
      stage: o.stage, lifecycleState: o.lifecycleState, status: o.status,
      confidenceScore: o.confidenceScore, matchScore: o.matchScore, actionabilityScore: o.actionabilityScore,
      estimatedValue: o.estimatedValue, estimatedTimeline: o.estimatedTimeline,
      tags: o.tags, urgency: o.urgency, verificationStatus: o.verificationStatus,
      featured: o.featured, trending: o.trending, sourceType: o.sourceType,
      detectedAt: o.detectedAt, createdAt: o.createdAt,
      realEstateKeys: o.realEstate ? Object.keys(o.realEstate) : null,
      companiesType: o.companies ? (Array.isArray(o.companies) ? `arr[${o.companies.length}]` : typeof o.companies) : null,
      signalsType: o.signals ? (Array.isArray(o.signals) ? `arr[${o.signals.length}]` : typeof o.signals) : null,
    };

    // Get pagination shape
    const pagination = oppBody.pagination;

    // Get stats structure
    const statsRes = await fetch(baseUrl + '/stats', { headers, signal: AbortSignal.timeout(8000) });
    let statsBody;
    try {
      statsBody = await statsRes.json();
    } catch {
      statsBody = { error: `Stats endpoint returned non-JSON (HTTP ${statsRes.status})` };
    }

    return Response.json({ opp, pagination, stats: statsBody });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});