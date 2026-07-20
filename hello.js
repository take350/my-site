export function onRequest(context) {
  return Response.json({
    message: "hello from Cloudflare Pages Functions",
    method: context.request.method,
    time: new Date().toISOString(),
  });
}
