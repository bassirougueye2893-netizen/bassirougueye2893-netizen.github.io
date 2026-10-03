export function onRequest() {
  return new Response(JSON.stringify({ ok: true, service: 'r2a-pages', time: new Date().toISOString() }), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff'
    }
  });
}
