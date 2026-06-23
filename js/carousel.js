/* ===================== 轮播图 ===================== */
class Carousel {
  constructor(el, options = {}) {
    this.el = el;
    this.slides = el.querySelectorAll('.carousel-slide');
    this.dots = el.querySelectorAll('.carousel-dot');
    this.prevBtn = el.querySelector('.carousel-prev');
    this.nextBtn = el.querySelector('.carousel-next');
    this.index = 0;
    this.interval = options.interval || 4000;
    this.autoPlay = options.autoPlay !== false;
    this.timer = null;

    this.prevBtn?.addEventListener('click', () => this.prev());
    this.nextBtn?.addEventListener('click', () => this.next());
    this.dots.forEach((dot, i) => dot.addEventListener('click', () => this.goTo(i)));

    let startX = 0;
    el.addEventListener('touchstart', e => startX = e.touches[0].clientX);
    el.addEventListener('touchend', e => {
      const diff = startX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) diff > 0 ? this.next() : this.prev();
    });

    if (this.autoPlay) this.startTimer();
  }

  goTo(i) {
    this.slides[this.index]?.classList.remove('active');
    this.dots[this.index]?.classList.remove('active');
    this.index = (i + this.slides.length) % this.slides.length;
    this.slides[this.index]?.classList.add('active');
    this.dots[this.index]?.classList.add('active');
    if (this.autoPlay) this.resetTimer();
  }

  next() { this.goTo(this.index + 1); }
  prev() { this.goTo(this.index - 1); }
  startTimer() { this.timer = setInterval(() => this.next(), this.interval); }
  resetTimer() { clearInterval(this.timer); this.startTimer(); }
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.carousel').forEach(c => new Carousel(c));
});
