# 费曼学习平台 · 第四次课

本项目承接 `项目/3rd`。`feynman-platform-backend` 保留第三次课的 Express、MongoDB、JWT 和知识点 API；`feynman-platform-frontend` 是本次新增的独立 React + Vite 应用，两者位于同一级目录。

![学习主页桌面预览](dashboard-preview.png)

## 启动前端

在 `feynman-platform-frontend` 目录运行：

```powershell
npm install
npm run dev
```

打开终端显示的地址，默认是 <http://localhost:5173>。分别访问 `/`、`/login`、`/register`，也可以使用顶部和侧边栏的链接切换。生产构建运行 `npm run build`。

## 启动已有后端

在另一个终端进入 `feynman-platform-backend`：

```powershell
npm install
npm start
```

后端默认位于 <http://localhost:3000>。本地 `.env` 沿用第三次课的配置，并由 `.gitignore` 忽略；在其他电脑运行时，使用 `.env.example` 配置自己的数据库连接与 JWT 密钥。前端 Vite 已预留 `/api` 代理，下一次课可直接用相对地址连接后端。

## 本次课完成的内容

- 使用 Vite 初始化 React 项目，`main.jsx` 将应用渲染到 `#root`，`App.jsx` 定义路由。
- 使用 `react-router-dom` 的 `BrowserRouter`、嵌套路由、`NavLink` 和 `Outlet`，实现 `/`、`/login`、`/register` 三个页面与持久显示的导航栏、侧边栏、主内容区。
- 将共用界面拆为 `Layout`、`Icon`、`ConceptCard` 等函数组件，通过 Props 传递内容。
- 登录和注册页面使用 `useState` 管理输入；注册包含 `username`、`email`、`password`，提交时阻止默认刷新并显示本地反馈。
- 页面在桌面和手机宽度下均可使用，并提供明确的表单标签和键盘焦点样式。

本次课按课件只实现前端界面和本地表单状态。表单提交不会调用后端，也不会创建账号或建立登录状态；第五次课再接入 API。
