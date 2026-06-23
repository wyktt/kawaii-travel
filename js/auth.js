/* ===================== 用户认证管理 ===================== */
const Auth = {
  USERS_KEY: 'kawaii_users',
  CURRENT_KEY: 'kawaii_current_user',

  // 获取所有注册用户
  getUsers() { return getStorage(this.USERS_KEY, []); },

  // 保存所有用户
  saveUsers(users) { setStorage(this.USERS_KEY, users); },

  // 获取当前登录用户
  getCurrentUser() { return getStorage(this.CURRENT_KEY, null); },

  // 注册新用户
  register(username, email, phone, password) {
    const users = this.getUsers();
    if (users.find(u => u.email === email)) {
      showToast('该邮箱已被注册', 'error');
      return false;
    }
    const user = {
      id: 'user_' + Date.now(),
      username: username,
      email: email,
      phone: phone,
      password: password,
      avatar: '🧸',
      createdAt: new Date().toISOString()
    };
    users.push(user);
    this.saveUsers(users);
    // 自动登录
    setStorage(this.CURRENT_KEY, { id: user.id, username: user.username, email: user.email, phone: user.phone, avatar: user.avatar });
    return true;
  },

  // 登录
  login(email, password) {
    const users = this.getUsers();
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) {
      showToast('邮箱或密码错误', 'error');
      return false;
    }
    setStorage(this.CURRENT_KEY, { id: user.id, username: user.username, email: user.email, phone: user.phone, avatar: user.avatar });
    return true;
  },

  // 退出登录
  logout() {
    localStorage.removeItem(this.CURRENT_KEY);
    this.updateNavbar();
    showToast('已退出登录');
  },

  // 是否已登录
  isLoggedIn() { return this.getCurrentUser() !== null; },

  // 更新导航栏显示
  updateNavbar() {
    const user = this.getCurrentUser();
    document.querySelectorAll('.nav-actions').forEach(nav => {
      if (user) {
        nav.innerHTML = `
          <a href="favorites.html" class="nav-icon-btn" title="收藏">💖</a>
          <a href="profile.html" class="nav-user-btn" title="个人中心">
            <span class="nav-user-avatar">${user.avatar}</span>
            <span class="nav-user-name">${user.username}</span>
          </a>
          <a href="#" class="btn btn-secondary btn-small" onclick="Auth.logout();return false;">退出</a>
        `;
      } else {
        nav.innerHTML = `
          <a href="login.html" class="btn btn-secondary btn-small">登录</a>
          <a href="register.html" class="btn btn-primary btn-small">注册</a>
        `;
      }
    });
  },

  // 检查登录状态，未登录则跳转
  requireLogin() {
    if (!this.isLoggedIn()) {
      showToast('请先登录', 'warning');
      setTimeout(() => { window.location.href = 'login.html'; }, 800);
      return false;
    }
    return true;
  }
};

document.addEventListener('DOMContentLoaded', () => Auth.updateNavbar());
