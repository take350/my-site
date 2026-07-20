// ESP32 上报真实数据的接收接口
// 路由：POST /api/update?key=API_KEY
// 数据存入 Cloudflare KV（绑定名 M24HA_KV）

export async function onRequestPost(context) {
  const { request, env } = context;

  // 简单鉴权：若已配置 API_TOKEN 环境变量，则必须带正确 key
  const token = new URL(request.url).searchParams.get("key");
  if (env.API_TOKEN && token !== env.API_TOKEN) {
    return new Response("Forbidden", { status: 403 });
  }

  let body;
  try {
    body = await request.json();
  } catch (e) {
    return new Response("Invalid JSON", { status: 400 });
  }

  const record = { ...body, ts: Date.now(), source: "esp32" };

  if (env.M24HA_KV) {
    await env.M24HA_KV.put("latest", JSON.stringify(record));
  } else {
    console.warn("M24HA_KV 未绑定，数据未存储");
  }

  return Response.json({ ok: true, ts: record.ts });
}

export async function onRequest(context) {
  const { request } = context;
  if (request.method === "POST") return onRequestPost(context);
  return new Response("Method Not Allowed. Use POST.", { status: 405 });
}
