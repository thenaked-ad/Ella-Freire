/* Ella Freire theme JS */
(function () {
  'use strict';
  window.ELLA = window.ELLA || {};
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var money = function (cents) {
    var fmt = (window.ELLA && window.ELLA.moneyFormat) || '£{{amount}}';
    var amt = (cents / 100).toFixed(2).replace(/\.00$/, '');
    return fmt.replace(/\{\{\s*amount[^}]*\}\}/, amt);
  };

  /* Header scroll */
  var header = $('#site-header');
  if (header) {
    var onScroll = function () { header.classList.toggle('is-scrolled', window.scrollY > 30); };
    window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
  }

  /* Mobile drawer nav */
  var burger = $('#burger'), drawerNav = $('#drawer-nav');
  if (burger && drawerNav) {
    burger.addEventListener('click', function () {
      var open = drawerNav.classList.toggle('is-open');
      burger.classList.toggle('is-open', open);
      burger.setAttribute('aria-expanded', open);
      document.body.classList.toggle('no-scroll', open);
    });
  }

  /* Reveal on scroll. initReveal() is re-run whenever Shopify re-renders a
     section in the theme editor, otherwise freshly injected .reveal elements
     would stay at opacity 0 and look like missing content. */
  var io = ('IntersectionObserver' in window) ? new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0, rootMargin: '0px 0px -6% 0px' }) : null;
  var designMode = !!(window.Shopify && window.Shopify.designMode);
  function initReveal(root, immediate) {
    $$('.reveal:not(.in)', root || document).forEach(function (el) {
      if (immediate || designMode || !io) el.classList.add('in');
      else io.observe(el);
    });
  }
  initReveal();
  window.ELLA.initReveal = initReveal;

  /* Accordions */
  function initAccordions(root) {
    $$('.acc__btn', root || document).forEach(function (b) {
      b.addEventListener('click', function () { b.closest('.acc').classList.toggle('is-open'); });
    });
  }
  initAccordions();

  /* Hero crossfade */
  var heroImgs = $$('.hero__media img[data-fade]');
  if (heroImgs.length > 1) {
    var hi = 0;
    setInterval(function () {
      heroImgs[hi].classList.add('is-hidden');
      hi = (hi + 1) % heroImgs.length;
      heroImgs[hi].classList.remove('is-hidden');
    }, 5000);
  }

  /* ---------- Cart drawer ---------- */
  var drawer = $('#cart-drawer'), overlay = $('#cart-overlay');
  var openCart = function () { if (!drawer) return; drawer.classList.add('is-open'); overlay.classList.add('is-open'); document.body.classList.add('no-scroll'); };
  var closeCart = function () { if (!drawer) return; drawer.classList.remove('is-open'); overlay.classList.remove('is-open'); document.body.classList.remove('no-scroll'); };
  $$('[data-cart-open]').forEach(function (b) { b.addEventListener('click', function (e) { e.preventDefault(); openCart(); }); });
  $$('[data-cart-close]').forEach(function (b) { b.addEventListener('click', closeCart); });
  if (overlay) overlay.addEventListener('click', closeCart);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { closeCart(); if (drawerNav && drawerNav.classList.contains('is-open')) burger.click(); } });

  function renderCart(cart) {
    $$('.cart-count').forEach(function (c) { c.textContent = cart.item_count; c.setAttribute('data-count', cart.item_count); });
    var body = $('#cart-drawer-body'), foot = $('#cart-drawer-foot');
    if (!body) return;
    if (!cart.items.length) {
      body.innerHTML = '<div class="cart-empty"><p>Your cart is empty.</p><p style="margin-top:14px"><a class="link" href="/collections/all">Browse the collection</a></p></div>';
      if (foot) foot.style.display = 'none';
      return;
    }
    if (foot) foot.style.display = '';
    body.innerHTML = cart.items.map(function (it, i) {
      var img = it.image ? it.image.replace(/(\.[a-z]+)(\?.*)?$/i, '_200x$1$2') : '';
      return '<div class="cart-line" data-line="' + (i + 1) + '">' +
        (img ? '<img src="' + img + '" alt="" width="76" height="95">' : '<div></div>') +
        '<div><div class="cart-line__title">' + it.product_title + '</div>' +
        (it.variant_title && it.variant_title !== 'Default Title' ? '<div class="cart-line__var">' + it.variant_title + '</div>' : '') +
        '<div class="qty"><button data-qty="-1" aria-label="Decrease">−</button><input value="' + it.quantity + '" aria-label="Quantity" readonly><button data-qty="1" aria-label="Increase">+</button></div>' +
        '<a href="#" class="cart-line__remove" data-remove>Remove</a></div>' +
        '<div class="cart-line__price">' + money(it.final_line_price) + '</div></div>';
    }).join('');
    var total = $('#cart-total'); if (total) total.textContent = money(cart.total_price);
    $$('.cart-line', body).forEach(function (line) {
      var n = +line.getAttribute('data-line');
      $$('[data-qty]', line).forEach(function (b) {
        b.addEventListener('click', function () {
          var q = +$('input', line).value + (+b.getAttribute('data-qty'));
          changeLine(n, Math.max(0, q));
        });
      });
      $('[data-remove]', line).addEventListener('click', function (e) { e.preventDefault(); changeLine(n, 0); });
    });
  }
  function changeLine(line, quantity) {
    fetch('/cart/change.js', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ line: line, quantity: quantity }) })
      .then(function (r) { return r.json(); }).then(renderCart).catch(function () {});
  }
  function refreshCart() { fetch('/cart.js').then(function (r) { return r.json(); }).then(renderCart).catch(function () {}); }
  if (drawer) refreshCart();

  /* Add to cart (AJAX) */
  function initAddToCart(root) {
  $$('form[data-product-form], #product-form', root || document).forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = $('[type="submit"]', form), original = btn.innerHTML;
      btn.disabled = true; btn.textContent = 'Adding…';
      fetch('/cart/add.js', { method: 'POST', body: new FormData(form), headers: { 'X-Requested-With': 'XMLHttpRequest' } })
        .then(function (r) { if (!r.ok) throw new Error(); return r.json(); })
        .then(function () { btn.innerHTML = 'Added'; refreshCart(); openCart(); setTimeout(function () { btn.innerHTML = original; btn.disabled = false; }, 1400); })
        .catch(function () { btn.textContent = 'Could not add'; setTimeout(function () { btn.innerHTML = original; btn.disabled = false; }, 1800); });
    });
  });
  }
  initAddToCart();

  /* ---------- Product page ---------- */
  function initProduct() {
  var pform = $('form[data-product-form], #product-form');
  if (pform && window.ELLA && window.ELLA.product) {
    var product = window.ELLA.product;
    var idInput = $('input[name="id"]', pform);
    var priceEl = $('#product-price'), stickyPrice = $('#sticky-price'), atc = $('#atc'), stickyAtc = $('#sticky-atc-btn');
    function selectVariant(v) {
      idInput.value = v.id;
      var p = money(v.price) + (v.compare_at_price && v.compare_at_price > v.price ? '<s>' + money(v.compare_at_price) + '</s>' : '');
      if (priceEl) priceEl.innerHTML = p;
      if (stickyPrice) stickyPrice.innerHTML = money(v.price);
      var label = v.available ? 'Add to Cart' : 'Sold Out';
      if (atc) { atc.textContent = label; atc.disabled = !v.available; }
      if (stickyAtc) { stickyAtc.textContent = label; stickyAtc.disabled = !v.available; }
      $$('.swatch').forEach(function (s) { s.classList.toggle('is-active', +s.getAttribute('data-variant') === v.id); });
      var sel = $('#option-selected'); if (sel) sel.textContent = v.title;
      if (v.featured_image && v.featured_image.src) showImage(v.featured_image.src);
    }
    $$('.swatch').forEach(function (s) {
      s.addEventListener('click', function () {
        var v = product.variants.filter(function (x) { return x.id === +s.getAttribute('data-variant'); })[0];
        if (v) selectVariant(v);
      });
    });
    /* Gallery */
    var mainImgs = $$('.gallery-main img'), thumbs = $$('.gallery-thumbs button');
    function showImage(src) {
      var key = src.split('?')[0].replace(/_\d+x\d*/, '');
      mainImgs.forEach(function (im, i) {
        var on = im.getAttribute('data-src').split('?')[0].replace(/_\d+x\d*/, '') === key;
        im.classList.toggle('is-active', on);
        if (thumbs[i]) thumbs[i].classList.toggle('is-active', on);
      });
    }
    thumbs.forEach(function (t, i) { t.addEventListener('click', function () { mainImgs.forEach(function (im, j) { im.classList.toggle('is-active', i === j); }); thumbs.forEach(function (tt, j) { tt.classList.toggle('is-active', i === j); }); }); });
    /* Sticky ATC on mobile */
    var sticky = $('#sticky-atc');
    if (sticky) {
      var sio = new IntersectionObserver(function (es) { sticky.classList.toggle('is-shown', !es[0].isIntersecting); }, { threshold: 0 });
      sio.observe(pform);
      if (stickyAtc) stickyAtc.addEventListener('click', function () { $('[type="submit"]', pform).click(); });
    }
  }
  }
  initProduct();

  /* Newsletter (Shopify customer form via fetch keeps user on page) */
  function initNewsletter(root) {
  $$('form[data-newsletter], #newsletter-form', root || document).forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var msg = $('.form-msg', form.parentNode) || form.parentNode.appendChild(Object.assign(document.createElement('div'), { className: 'form-msg' }));
      fetch(form.action, { method: 'POST', body: new FormData(form) })
        .then(function () { msg.textContent = 'Thank you. You are on the list.'; form.reset(); })
        .catch(function () { msg.textContent = 'Something went wrong. Please try again.'; msg.classList.add('form-msg--error'); });
    });
  });
  }
  initNewsletter();

  /* Theme editor: a re-rendered section arrives with fresh DOM and no bound
     listeners, so everything interactive is wired up again here. */
  document.addEventListener('shopify:section:load', function (e) {
    var root = e.target;
    initReveal(root, true);
    initAccordions(root);
    initAddToCart(root);
    initNewsletter(root);
    initFilters(root);
    initProduct();
    if (window.ELLA_MAPS && typeof window.ELLA_MAPS.init === 'function') window.ELLA_MAPS.init(root);
  });

  /* Collection filters (client side by tag/collection handle already on page) */
  function initFilters(root) {
  $$('[data-filter]', root || document).forEach(function (chip) {
    chip.addEventListener('click', function () {
      var f = chip.getAttribute('data-filter');
      $$('[data-filter]').forEach(function (c) { c.classList.toggle('is-active', c === chip); });
      $$('[data-airline]').forEach(function (card) { card.style.display = (f === 'all' || card.getAttribute('data-airline') === f) ? '' : 'none'; });
    });
  });
  }
  initFilters();
})();
