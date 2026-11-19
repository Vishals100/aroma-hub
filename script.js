(() => {
  const loader = document.getElementById('page-loader');
  const nav = document.getElementById('navbar');
  const menuToggle = document.getElementById('menu-toggle');
  const closeMenu = document.getElementById('close-menu');
  const overlay = document.getElementById('menu-overlay');
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toast-message');
  let toastTimer;

  // Branded loading screen: disappears after page assets are ready (with a short minimum display).
  const hideLoader = () => window.setTimeout(() => loader?.classList.add('is-hidden'), 450);
  if (document.readyState === 'complete') hideLoader();
  else window.addEventListener('load', hideLoader, { once: true });
  window.setTimeout(() => loader?.classList.add('is-hidden'), 3000); // fallback for slow or unavailable assets

  // Mobile navigation: sync drawer, overlay and accessibility state.
  const setMenu = (open) => {
    if (!nav || !menuToggle) return;
    nav.classList.toggle('open', open);
    overlay?.classList.toggle('show', open);
    document.body.classList.toggle('menu-open', open);
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    nav.setAttribute('aria-hidden', String(!open && window.matchMedia('(max-width: 760px)').matches));
    if (open) closeMenu?.focus();
    else menuToggle.focus({ preventScroll: true });
  };

  menuToggle?.addEventListener('click', (event) => {
    event.preventDefault();
    if (nav) setMenu(!nav.classList.contains('open'));
  });
  closeMenu?.addEventListener('click', (event) => {
    event.preventDefault();
    setMenu(false);
  });
  overlay?.addEventListener('click', () => setMenu(false));
  nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && nav?.classList.contains('open')) setMenu(false);
  });
  window.addEventListener('resize', () => {
    if (window.matchMedia('(min-width: 761px)').matches) {
      nav?.classList.remove('open');
      overlay?.classList.remove('show');
      document.body.classList.remove('menu-open');
      menuToggle?.setAttribute('aria-expanded', 'false');
      menuToggle?.setAttribute('aria-label', 'Open menu');
      nav?.setAttribute('aria-hidden', 'false');
    } else if (nav && !nav.classList.contains('open')) {
      nav.setAttribute('aria-hidden', 'true');
    }
  });
  if (nav) nav.setAttribute('aria-hidden', String(window.matchMedia('(max-width: 760px)').matches));

  const showToast = (message) => {
    if (!toast || !toastMessage) return;
    toastMessage.textContent = message;
    toast.classList.add('show');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove('show'), 2400);
  };

  // Product detail quantity selector and WhatsApp order action.
  document.querySelectorAll('[data-quantity-action]').forEach(button => {
    button.addEventListener('click', () => {
      const output = document.getElementById('product-quantity');
      if (!output) return;
      const current = Number(output.textContent) || 1;
      output.textContent = String(Math.max(1, current + (button.dataset.quantityAction === 'increase' ? 1 : -1)));
    });
  });

  document.querySelectorAll('.product-order-whatsapp').forEach(link => {
    link.addEventListener('click', event => {
      const quantity = Number(document.getElementById('product-quantity')?.textContent) || 1;
      const productName = link.dataset.product || 'product';
      const message = `Hello AromaHub, I would like to order ${quantity} x ${productName}. Please confirm availability and delivery details.`;
      link.href = `https://wa.me/919605514144?text=${encodeURIComponent(message)}`;
    });
  });

  // Reveal content as it enters the viewport.
  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealItems.forEach(item => observer.observe(item));
  } else revealItems.forEach(item => item.classList.add('visible'));

  // Newsletter demo interaction (connect a mailing service/backend for real subscriptions).
  document.getElementById('newsletter-form')?.addEventListener('submit', event => {
    event.preventDefault();
    const email = document.getElementById('newsletter-email');
    if (email?.checkValidity()) {
      showToast('Thanks for subscribing!');
      email.value = '';
    }
  });

  const year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
