import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import Icon from './Icon.jsx';
import { useAuth } from '../context/AuthContext.jsx';

function Layout() {
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const navigation = token
    ? [{ to: '/', label: '学习主页', icon: 'home', end: true }]
    : [{ to: '/login', label: '登录账号', icon: 'user' }, { to: '/register', label: '创建账号', icon: 'book' }];

  function handleLogout() {
    logout();
    navigate('/login', { replace: true });
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <Link to="/" className="brand" aria-label="费曼学习平台首页">
          <span className="brand-mark">F<span>.</span></span>
          <span className="brand-name">费曼<span>学习平台</span></span>
        </Link>
        <div className="topbar-right">
          <span className="course-label"><span className="course-dot" />大前端与 AI 实战 · 第 05 课</span>
          {token
            ? <button className="topbar-link topbar-button" type="button" onClick={handleLogout}>退出登录 <Icon name="arrow" size={16} /></button>
            : <Link className="topbar-link" to="/register">开始学习 <Icon name="arrow" size={16} /></Link>}
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
              <strong>让页面与后端<br />真正连接起来</strong>
              <p>注册、登录、全局状态与路由守卫，完成账号流程。</p>
              <span>Axios · Context · CORS</span>
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
