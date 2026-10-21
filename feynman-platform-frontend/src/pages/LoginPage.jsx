import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Icon from '../components/Icon.jsx';
import apiClient from '../api/axios.js';
import { useAuth } from '../context/AuthContext.jsx';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage('');
    setSubmitting(true);
    try {
      const response = await apiClient.post('/users/login', { email: email.trim(), password });
      login(response.data.token);
      navigate(location.state?.from?.pathname || '/', { replace: true });
    } catch (error) {
      setMessage(error.response?.data?.msg || '登录失败，请检查网络连接后重试。');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="page auth-page">
      <div className="page-eyebrow"><span className="eyebrow-line" />账号空间 <span className="eyebrow-separator">/</span> SIGN IN</div>
      <div className="auth-layout">
        <div className="auth-intro"><span className="auth-step">01 / 02</span><h1>欢迎回来，<br /><em>继续探索。</em></h1><p>登录后继续整理你的知识点，一步步把“我知道”变成“我能讲清楚”。</p><div className="auth-quote"><span>“</span><p>如果你不能简单地解释它，说明你还没有真正理解它。</p><small>费曼学习法</small></div></div>
        <section className="auth-card" aria-labelledby="login-title">
          <div className="auth-card-icon"><Icon name="user" size={22} /></div>
          <p className="form-kicker">WELCOME BACK</p>
          <h2 id="login-title">登录账号</h2>
          <p className="form-intro">{location.state?.registered ? '注册成功！请登录账号，开始学习。' : '输入你的邮箱和密码，继续学习旅程。'}</p>
          <form onSubmit={handleSubmit}>
            <label className="field-label" htmlFor="login-email">邮箱地址</label>
            <div className="input-wrap"><Icon name="mail" size={18} /><input id="login-email" type="email" autoComplete="email" placeholder="you@example.com" maxLength={254} value={email} onChange={(event) => { setEmail(event.target.value); setMessage(''); }} required /></div>
            <label className="field-label" htmlFor="login-password">密码</label>
            <div className="input-wrap"><Icon name="lock" size={18} /><input id="login-password" type="password" autoComplete="current-password" placeholder="输入你的密码" value={password} onChange={(event) => { setPassword(event.target.value); setMessage(''); }} required /></div>
            <button className="button button-primary form-submit" type="submit" disabled={submitting}>{submitting ? '登录中…' : '登录'} <Icon name="arrow" size={18} /></button>
            <p className="form-message error" role="alert">{message}</p>
          </form>
          <p className="auth-switch">还没有账号？<Link to="/register">立即注册 <Icon name="arrow" size={15} /></Link></p>
        </section>
      </div>
    </div>
  );
}

export default LoginPage;
