# 费曼学习平台 · 第五次课 MERGE记录

本目录承接 `项目/4th`，完成前后端联调与登录状态管理。后端提供注册、登录和受 JWT 保护的知识点 API；前端在原有页面上接入真实请求、React Context 与路由守卫。

## 启动

需要 Node.js、npm 和可连接的 MongoDB。在 `feynman-platform-backend` 中复制 `.env.example` 为 `.env`，填写 `MONGO_URI` 和至少 32 字符的 `JWT_SECRET`。课程四目录中的私有 `.env` 没有复制到这里。

先启动后端：

```powershell
cd .\feynman-platform-backend
npm install
npm start
```

再开一个终端启动前端：

```powershell
cd .\feynman-platform-frontend
npm install
npm run dev
```

默认打开 <http://localhost:5173>，前端直接请求 <http://localhost:3000/api>，以便观察浏览器的 CORS 预检请求。如果后端地址不同，可在前端目录创建 `.env.local`，填写 `VITE_API_BASE_URL=http://你的地址/api`；跨域来源也需在后端 `index.js` 的 CORS 设置中允许。前端开发服务器固定使用 5173 端口；若端口已被占用，请先关闭占用该端口的程序。

## 验收流程

1. 清除浏览器中此站点的 `token`，直接访问 `/`，应跳转 `/login`。
2. 前往 `/register` 注册，成功后跳转 `/login`；重复邮箱注册会显示后端错误。
3. 登录后进入 `/`。刷新页面后仍停留在主页。
4. 点击“退出登录”，应返回登录页；再次访问 `/` 仍会被守卫拦截。

密码和数据库连接等配置由后端管理。浏览器只保存课程要求的 JWT Token；后端仍会对受保护 API 验证 Token。`npm test` 可运行后端接口及 CORS 预检测试，前端可运行 `npm run build` 检查生产构建。
