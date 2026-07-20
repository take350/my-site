export function onRequest(context) {
  const url = new URL(context.request.url);
  const name = url.searchParams.get("name") || "world";
  return Response.json({
    echo: name,
    allParams: Object.fromEntries(url.searchParams),
    time: new Date().toISOString(),
  });
}
