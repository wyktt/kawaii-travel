/* ===================== 收藏与购物车 ===================== */
const Favorites = {
  KEY: 'kawaii_favorites',
  getAll() { return getStorage(this.KEY, []); },
  toggle(id) {
    const list = this.getAll();
    const idx = list.indexOf(id);
    if (idx > -1) { list.splice(idx, 1); showToast('已取消收藏'); }
    else { list.push(id); showToast('已加入收藏 💖'); }
    setStorage(this.KEY, list);
    return list.includes(id);
  },
  has(id) { return this.getAll().includes(id); },
  count() { return this.getAll().length; }
};

const Cart = {
  KEY: 'kawaii_cart',
  getAll() { return getStorage(this.KEY, []); },
  add(item) {
    const list = this.getAll();
    const exist = list.find(i => i.id === item.id);
    if (exist) { exist.qty += (item.qty || 1); }
    else { list.push({ ...item, qty: item.qty || 1 }); }
    setStorage(this.KEY, list);
    showToast('已加入订单 🛒');
    this.updateBadge();
  },
  remove(id) {
    const list = this.getAll().filter(i => i.id !== id);
    setStorage(this.KEY, list);
    this.updateBadge();
  },
  clear() { setStorage(this.KEY, []); this.updateBadge(); },
  total() { return this.getAll().reduce((s, i) => s + i.price * i.qty, 0); },
  count() { return this.getAll().reduce((s, i) => s + i.qty, 0); },
  updateBadge() {
    document.querySelectorAll('.cart-badge').forEach(b => {
      const c = this.count();
      b.textContent = c;
      b.style.display = c > 0 ? 'inline' : 'none';
    });
  }
};

document.addEventListener('DOMContentLoaded', () => Cart.updateBadge());
