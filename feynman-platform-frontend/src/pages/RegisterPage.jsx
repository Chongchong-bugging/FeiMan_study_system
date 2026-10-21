import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Icon from '../components/Icon.jsx';
import apiClient from '../api/axios.js';

function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage('');
    if (!username.trim()) {
      setMessage('请输入用户名。');
      return;
    }
    if (new TextEncoder().encode(password).length > 72) {
      setMessage('密码的 UTF-8 长度不能超过 72 字节。');
      return;
    }
    setSubmitting(true);
    try {
      await apiClient.post('/users/register', { username: username.trim(), email: email.trim(), password });
      navigate('/login', { replace: true, state: { registered: true } });
    } catch (error) {
      setMessage(error.response?.data?.msg || '注册失败，请检查网络连接后重试。');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="page auth-page">
      <div className="page-eyebrow"><span className="eyebrow-line" />账号空间 <span className="eyebrow-separator">/</span> CREATE ACCOUNT</div>
      <div className="auth-layout">
        <div className="auth-intro"><span className="auth-step">02 / 02</span><h1>每一次讲述，<br /><em>都是一次理解。</em></h1><p>创建你的学习账号，为每一个知识点留一处可以思考、表达和复习的地方。</p><div className="auth-quote"><span>✳</span><p>把学到的内容写下来，再试着讲给别人听。</p><small>从这里开始</small></div></div>
        <section className="auth-card" aria-labelledby="register-title">
          <div className="auth-card-icon"><Icon name="spark" size={22} /></div>
          <p className="form-kicker">BEGIN YOUR JOURNEY</p>
          <h2 id="register-title">创建账号</h2>
          <p className="form-intro">只需三项信息，就能准备开始学习。</p>
          <form onSubmit={handleSubmit}>
            <label className="field-label" htmlFor="register-username">用户名</label>
            <div className="input-wrap"><Icon name="user" size={18} /><input id="register-username" type="text" autoComplete="username" placeholder="给自己取一个名字" maxLength={50} value={username} onChange={(event) => { setUsername(event.target.value); setMessage(''); }} required /></div>
            <label className="field-label" htmlFor="register-email">邮箱地址</label>
            <div className="input-wrap"><Icon name="mail" size={18} /><input id="register-email" type="email" autoComplete="email" placeholder="you@example.com" maxLength={254} value={email} onChange={(event) => { setEmail(event.target.value); setMessage(''); }} required /></div>
            <label className="field-label" htmlFor="register-password">密码</label>
            <div className="input-wrap"><Icon name="lock" size={18} /><input id="register-password" type="password" autoComplete="new-password" placeholder="至少 8 个字符" minLength={8} aria-describedby="password-hint" value={password} onChange={(event) => { setPassword(event.target.value); setMessage(''); }} required /></div>
            <p className="field-hint" id="password-hint">至少 8 个字符，UTF-8 长度不超过 72 字节。</p>
            <button className="button button-primary form-submit" type="submit" disabled={submitting}>{submitting ? '注册中…' : '创建账号'} <Icon name="arrow" size={18} /></button>
            <p className="form-message error" role="alert">{message}</p>
          </form>
          <p className="auth-switch">已经有账号？<Link to="/login">前往登录 <Icon name="arrow" size={15} /></Link></p>
        </section>
      </div>
    </div>
  );
}

export default RegisterPage;
