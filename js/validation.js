/* ===================== 表单验证 ===================== */
const validators = {
  required: (v) => v.trim() !== '' ? '' : '此项为必填项',
  email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? '' : '请输入有效的邮箱地址',
  phone: (v) => /^1[3-9]\d{9}$/.test(v) ? '' : '请输入有效的手机号码',
  minLength: (len) => (v) => v.length >= len ? '' : `最少需要${len}个字符`,
  maxLength: (len) => (v) => v.length <= len ? '' : `最多不超过${len}个字符`,
  password: (v) => {
    if (v.length < 6) return '密码至少6个字符';
    return '';
  },
  confirmPassword: (getPwd) => (v) => v === getPwd() ? '' : '两次密码输入不一致',
  digits: (v) => /^\d+$/.test(v) ? '' : '请输入数字',
  date: (v) => v !== '' ? '' : '请选择日期',
};

function validateField(input) {
  const rules = input.dataset.validate?.split('|') || [];
  const errorEl = input.parentElement.querySelector('.form-error');
  for (const rule of rules) {
    const [name, arg] = rule.split(':');
    const fn = validators[name];
    if (!fn) continue;
    const check = name === 'confirmPassword'
      ? validators.confirmPassword(() => input.closest('form').querySelector('[data-validate*="password"]:not([data-validate*="confirm"])')?.value || '')
      : name === 'minLength' || name === 'maxLength'
        ? fn(Number(arg))
        : fn;
    const msg = check(input.value);
    if (msg) {
      input.classList.add('error');
      input.classList.remove('success');
      if (errorEl) { errorEl.textContent = msg; errorEl.classList.add('show'); }
      return false;
    }
  }
  input.classList.remove('error');
  input.classList.add('success');
  if (errorEl) errorEl.classList.remove('show');
  return true;
}

function validateForm(form) {
  const fields = form.querySelectorAll('[data-validate]');
  let valid = true;
  fields.forEach(f => { if (!validateField(f)) valid = false; });
  return valid;
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('form').forEach(form => {
    const submitBtn = form.querySelector('[type="submit"]');
    form.querySelectorAll('[data-validate]').forEach(input => {
      input.addEventListener('input', () => validateField(input));
      input.addEventListener('blur', () => validateField(input));
    });
    if (submitBtn) {
      submitBtn.addEventListener('click', (e) => {
        if (!validateForm(form)) {
          e.preventDefault();
          showToast('请检查表单中的错误', 'error');
        }
      });
    }
  });
});
