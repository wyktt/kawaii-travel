/* ===================== 主逻辑 ===================== */
document.addEventListener('DOMContentLoaded', () => {

  /* --- 导航栏滚动效果 --- */
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', throttle(() => {
      navbar.classList.toggle('scrolled', window.scrollY > 50);
    }, 100));
  }

  /* --- 汉堡菜单 --- */
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  const mobileClose = document.querySelector('.mobile-close');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => mobileMenu.classList.add('open'));
    if (mobileClose) mobileClose.addEventListener('click', () => mobileMenu.classList.remove('open'));
    mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mobileMenu.classList.remove('open')));
  }

  /* --- 返回顶部 --- */
  const backToTop = document.querySelector('.back-to-top');
  if (backToTop) {
    window.addEventListener('scroll', throttle(() => {
      backToTop.classList.toggle('visible', window.scrollY > 400);
    }, 100));
    backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* --- 滚动触发动画 --- */
  const scrollElements = document.querySelectorAll('.scroll-animate');
  if (scrollElements.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    scrollElements.forEach(el => observer.observe(el));
  }

  /* --- 图片懒加载 --- */
  const lazyImages = document.querySelectorAll('img[data-src]');
  if (lazyImages.length > 0) {
    const imgObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          imgObserver.unobserve(img);
        }
      });
    }, { rootMargin: '100px' });
    lazyImages.forEach(img => imgObserver.observe(img));
  }

  /* --- Tab 切换 --- */
  const tabBtns = document.querySelectorAll('.tab-btn');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const group = btn.closest('.tabs');
      const contentContainer = group?.nextElementSibling || btn.closest('.section');
      group.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const target = btn.dataset.tab;
      if (contentContainer) {
        contentContainer.querySelectorAll('.tab-content').forEach(c => {
          c.classList.toggle('active', c.id === target);
        });
      }
    });
  });

  /* --- 手风琴折叠 --- */
  document.querySelectorAll('.accordion-header').forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const content = item.querySelector('.accordion-content');
      const isOpen = item.classList.contains('open');
      // 关闭其他
      item.parentElement.querySelectorAll('.accordion-item').forEach(i => {
        i.classList.remove('open');
        const c = i.querySelector('.accordion-content');
        if (c) c.style.maxHeight = null;
      });
      if (!isOpen) {
        item.classList.add('open');
        if (content) content.style.maxHeight = content.scrollHeight + 'px';
      }
    });
  });

  /* --- 模态框 --- */
  document.querySelectorAll('[data-modal]').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const modalId = trigger.dataset.modal;
      const overlay = document.getElementById(modalId);
      if (overlay) overlay.classList.add('open');
    });
  });
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) overlay.classList.remove('open');
    });
    const closeBtn = overlay.querySelector('.modal-close');
    if (closeBtn) closeBtn.addEventListener('click', () => overlay.classList.remove('open'));
  });

  /* --- 爱心收藏按钮 --- */
  document.querySelectorAll('.heart-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      btn.classList.toggle('liked');
      if (btn.classList.contains('liked')) {
        createParticles(e, ['💖', '💕', '❤️', '✨']);
      }
    });
  });

  /* --- 页面加载动画 --- */
  document.body.classList.add('loaded');
});
