const form = document.getElementById('account-form');
const fields = document.getElementById('account-fields');
const usernameInput = document.getElementById('username');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const confirmationInput = document.getElementById('confirm-password');
const registerModeBtn = document.getElementById('register-mode');
const loginModeBtn = document.getElementById('login-mode');
const submitBtn = document.getElementById('submit-btn');
const messageEl = document.getElementById('account-message');
let mode = 'register';
let submitting = false;

function showMessage(text, state = '') {
  messageEl.textContent = text;
  messageEl.dataset.state = state;
}

function setMode(nextMode) {
  mode = nextMode;
  const registering = mode === 'register';
  document.getElementById('username-field').hidden = !registering;
  document.getElementById('confirmation-field').hidden = !registering;
  document.getElementById('password-help').hidden = !registering;
  usernameInput.disabled = !registering;
  confirmationInput.disabled = !registering;
  passwordInput.minLength = registering ? 8 : 1;
  passwordInput.autocomplete = registering ? 'new-password' : 'current-password';
  passwordInput.value = '';
  confirmationInput.value = '';
  registerModeBtn.setAttribute('aria-pressed', String(registering));
  loginModeBtn.setAttribute('aria-pressed', String(!registering));
  document.getElementById('form-title').textContent = registering ? '创建你的账号' : '登录你的账号';
  document.getElementById('form-intro').textContent = registering
    ? '填写信息，开始记录你的学习。'
    : '使用注册时的邮箱和密码登录。';
  submitBtn.textContent = registering ? '注册账号' : '登录账号';
  showMessage('');
}

function setSubmitting(value) {
  submitting = value;
  fields.disabled = value;
  submitBtn.disabled = value;
  registerModeBtn.disabled = value;
  loginModeBtn.disabled = value;
  form.setAttribute('aria-busy', String(value));
  submitBtn.textContent = value
    ? (mode === 'register' ? '正在注册…' : '正在登录…')
    : (mode === 'register' ? '注册账号' : '登录账号');
}

registerModeBtn.addEventListener('click', () => {
  if (!submitting) setMode('register');
});
loginModeBtn.addEventListener('click', () => {
  if (!submitting) setMode('login');
});

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (submitting || !form.reportValidity()) return;
  const email = emailInput.value.trim();
  const password = passwordInput.value;
  const username = usernameInput.value.trim();
  const registering = mode === 'register';
  if (registering && !username) {
    showMessage('请输入用户名。', 'error');
    return;
  }
  if (registering && password !== confirmationInput.value) {
    showMessage('两次输入的密码不一致。', 'error');
    return;
  }
  if (new TextEncoder().encode(password).length > 72) {
    showMessage('密码过长，请缩短后重试。', 'error');
    return;
  }

  setSubmitting(true);
  showMessage('');
  try {
    const response = await fetch(registering ? '/api/users/register' : '/api/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(registering ? { username, email, password } : { email, password })
    });
    const data = await response.json();
    if (!response.ok) {
      const translations = {
        'Email already exists': '该邮箱已经注册，请切换到登录。',
        'Username already exists': '该用户名已被使用，请换一个用户名。',
        'Server Error': '服务暂时不可用，请稍后重试。'
      };
      showMessage(translations[data.msg] || data.msg || '操作失败，请稍后重试。', 'error');
      return;
    }
    sessionStorage.setItem('feynman-token', data.token);
    sessionStorage.setItem('feynman-user', data.user.username);
    form.reset();
    showMessage(`${registering ? '注册并登录成功' : '登录成功'}，欢迎你，${data.user.username}！访问令牌已保存在当前标签页。`, 'success');
  } catch (err) {
    showMessage(registering
      ? '无法确认注册结果，请检查服务连接后重试。'
      : '无法完成登录，请检查服务连接后重试。', 'error');
  } finally {
    setSubmitting(false);
  }
});
