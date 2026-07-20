// 拓阳 M24HA 实时数据接口
// 优先返回 ESP32 上报的真实数据（存于 Cloudflare KV）；没有实时数据时用模拟数据兜底
// 字段与前端 index.html 一一对应

function jitter(base, range, digits = 1) {
  const v = base + (Math.random() * 2 - 1) * range;
  return Number(v.toFixed(digits));
}

export async function onRequest(context) {
  const { env } = context;

  // 1) 优先尝试 KV 里的真实数据（ESP32 上报）
  if (env.M24HA_KV) {
    try {
      const raw = await env.M24HA_KV.get("latest");
      if (raw) {
        const data = JSON.parse(raw);
        const fresh = data.ts && (Date.now() - data.ts) < 5 * 60 * 1000; // 5 分钟内算有效
        if (fresh) {
          return Response.json({ ...data, source: "esp32" });
        }
      }
    } catch (e) {
      // KV 读取异常，降级到模拟数据
    }
  }

  // 2) 兜底：模拟数据（上线前 / ESP32 未连接时页面仍有内容）
  const pvVoltage = jitter(45.5, 2.5, 1);
  const pvCurrent = jitter(5.6, 0.8, 2);
  const pvPower = Math.round(pvVoltage * pvCurrent);
  const batVoltage = jitter(24.12, 0.3, 2);
  const soc = jitter(98.2, 1.2, 1);
  const loadCurrent = jitter(1.8, 0.4, 2);
  const loadPower = Math.round(batVoltage * loadCurrent);
  const chargeStage = pvPower > 30 ? "恒压" : "浮充";

  return Response.json({
    model: "M24HA",
    pvVoltage,
    pvCurrent,
    pvPower: Math.min(pvPower, 300),
    batVoltage,
    soc: Math.min(soc, 100),
    loadCurrent,
    loadPower,
    todayWh: 855 + Math.round(Math.random() * 20),
    totalWh: 12345 + Math.round(Math.random() * 200),
    temperature: jitter(25, 3, 0),
    chargeStage,
    charging: pvPower > 5,
    time: new Date().toISOString(),
    source: "simulated",
  });
}
