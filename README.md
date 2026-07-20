# 部署到 Cloudflare Pages（详细步骤 · 方案 B）

无需信用卡、无需自建服务器。本文件夹即一个可直接部署的 demo：
一个静态首页 + 两个接口（`/hello`、`/echo`）。

```
cloudflare-demo/
├── index.html          # 静态首页
└── functions/
    ├── hello.js        # 接口 /hello
    └── echo.js         # 接口 /echo?name=xxx
```

---

## 准备（只需一次）
1. 注册 Cloudflare 账号：https://dash.cloudflare.com/sign-up （邮箱即可，免卡）
2. 注册 GitHub 账号：https://github.com （用于自动部署；不想用 GitHub 见文末「拖拽方案」）

---

## 第 1 步：本地预览（可选）
想先在本地看看效果：
```bash
cd cloudflare-demo
npx wrangler pages dev .
# 打开 http://localhost:8788
```

---

## 第 2 步：把代码推到 GitHub
```bash
cd cloudflare-demo
git init
git add .
git commit -m "first deploy"
```
然后在 github.com 点 **New repository** 新建一个空仓库（如 `my-site`），复制它的地址，执行：
```bash
git branch -M main
git remote add origin https://github.com/你的用户名/my-site.git
git push -u origin main
```

---

## 第 3 步：Cloudflare 控制台连接
1. 打开 https://dash.cloudflare.com
2. 左侧菜单选 **Workers 和 Pages**（或 **Pages**）
3. 点 **Create** → 选 **Pages** → 选 **连接到 Git**
4. 授权 GitHub，选择刚才的 `my-site` 仓库
5. 构建设置：
   - Framework preset：**无（None）**
   - Build command：**留空**
   - Build output directory：**留空**（根目录）
6. 点 **Save and Deploy**

等待约 1 分钟，状态变绿即部署成功。

---

## 第 4 步：访问
部署完会得到一个 `https://my-site-xxxx.pages.dev` 域名：
- 首页：https://my-site-xxxx.pages.dev/
- 接口：https://my-site-xxxx.pages.dev/hello
- 接口：https://my-site-xxxx.pages.dev/echo?name=张三

---

## 第 5 步：以后怎么更新
改完代码后，只要：
```bash
git add .
git commit -m "update"
git push
```
Cloudflare 会自动重新部署，不用再进控制台。

---

## 免 GitHub 的「拖拽方案」
1. 打开 https://dash.cloudflare.com → **Pages** → **Create** → **直接上传**
2. 把 `cloudflare-demo` 文件夹压缩成 zip，或直接把文件夹拖进去
3. 上传即部署，同样拿到 `.pages.dev` 域名

缺点：以后更新要手动重新拖，没有自动部署。推荐还是用上面的 GitHub 方案。

---

## 绑定自己的域名（可选）
Pages 项目里 → **自定义域** → 填你的域名 → 按提示去域名 DNS 加一条 CNAME。
没有域名也能一直用 `xxx.pages.dev`。

---

## 常见问题
- **国内能访问吗？** `.pages.dev` 在国内基本能直连，速度尚可。
- **免费额度够吗？** 个人站点/接口完全够，每天请求量很大的话再看付费。
- **接口能连数据库吗？** 可以，Cloudflare 有 D1（SQLite）/ KV / Durable Objects，均免费有额度。
