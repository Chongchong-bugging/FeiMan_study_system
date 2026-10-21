import { Link, NavLink, Outlet } from 'react-router-dom';
import Icon from './Icon.jsx';

const navigation = [
  { to: '/', label: '学习主页', icon: 'home', end: true },
  { to: '/login', label: '登录账号', icon: 'user' },
  { to: '/register', label: '创建账号', icon: 'book' },
];

function Layout() {
  return (
    <div className="app-shell">
      <header className="topbar">
        <Link to="/" className="brand" aria-label="费曼学习平台首页">
          <span className="brand-mark">F<span>.</span></span>
          <span className="brand-name">费曼<span>学习平台</span></span>
        </Link>
        <div className="topbar-right">
          <span className="course-label"><span className="course-dot" />大前端与 AI 实战 · 第 04 课</span>
          <Link className="topbar-link" to="/register">开始学习 <Icon name="arrow" size={16} /></Link>
        </div>
      </header>

      <div className="workspace">
        <aside className="sidebar" aria-label="侧边栏">
          <div className="sidebar-inner">
            <p className="nav-caption">工作空间</p>
            <nav className="side-nav" aria-label="主导航">
              {navigation.map(({ to, label, icon, end }) => (
                <NavLink key={to} to={to} end={end} className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
                  <Icon name={icon} size={19} />
                  <span>{label}</span>
                  <span className="nav-arrow">↗</span>
                </NavLink>
              ))}
            </nav>

            <div className="sidebar-spacer" />
            <div className="lesson-note">
              <div className="lesson-note-icon"><Icon name="spark" size={19} /></div>
              <p className="lesson-note-kicker">本次课程</p>
              <strong>让知识有了<br />看得见的界面</strong>
              <p>从组件、路由到表单状态，搭起学习平台的第一屏。</p>
              <span>React · Vite · Router</span>
            </div>
            <div className="sidebar-footer">FEYNMAN / 2026</div>
          </div>
        </aside>

        <main className="main-content" id="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;
