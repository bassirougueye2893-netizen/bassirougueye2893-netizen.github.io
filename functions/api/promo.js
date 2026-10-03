function json(body, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'no-referrer'
  }});
}

export async function onRequestPost(context) {
  try {
    const body = await context.request.json();
    const code = String(body && body.code || '').trim().toUpperCase();
    if (!code || code.length > 64) return json({ valid:false }, 400);

    let promos = [];
    try { promos = JSON.parse(context.env.PROMO_CODES_JSON || '[]'); } catch (_) {}
    const match = promos.find(p => p && p.active !== false && String(p.code || '').trim().toUpperCase() === code);
    if (!match) return json({ valid:false }, 404);

    const type = match.type === 'fixed' ? 'fixed' : 'percent';
    const value = Number(match.value);
    if (!Number.isFinite(value) || value < 0) return json({ valid:false }, 500);
    return json({ valid:true, promo:{ code, type, value } });
  } catch (_) {
    return json({ valid:false }, 400);
  }
}

export function onRequest() {
  return json({ error:'Method not allowed' }, 405);
}
