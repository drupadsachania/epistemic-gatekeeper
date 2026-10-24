// Kairos site behaviour: theme toggle, sticky-nav hairline, reveal on scroll.
// Load with <script src="kairos.js" defer>. Put the one-line first-paint script (see README) inline in <head>
// so a stored dark theme applies before paint. Light is the default; the OS dark setting is never read.
(function () {
  var root = document.documentElement

  // Theme toggle: writes data-theme on <html> and remembers it. Storage can be blocked, so guard every access.
  // Icons are inline SVG (currentColor): text glyphs like a moon character render inconsistently in Red Hat Mono.
  var MOON = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>'
  var SUN = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>'
  var toggle = document.querySelector('.k-theme-toggle')
  function setTheme (t) {
    if (t === 'dark') root.setAttribute('data-theme', 'dark'); else root.removeAttribute('data-theme')
    if (toggle) { toggle.setAttribute('aria-pressed', String(t === 'dark')); toggle.innerHTML = t === 'dark' ? SUN : MOON }
    try { localStorage.setItem('kairos-theme', t) } catch (e) {}
  }
  if (toggle) {
    setTheme(root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light')
    toggle.addEventListener('click', function () { setTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark') })
  }

  // Sticky nav: one passive listener, one attribute, no layout reads inside the handler.
  var nav = document.querySelector('.k-nav')
  if (nav) {
    var ticking = false
    addEventListener('scroll', function () {
      if (ticking) return
      ticking = true
      requestAnimationFrame(function () { nav.dataset.scrolled = String(scrollY > 8); ticking = false })
    }, { passive: true })
  }

  // Reveal on scroll. Server HTML is fully visible; only elements below the fold are hidden, and only by JS.
  // No IntersectionObserver or reduced motion = nothing is ever hidden.
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return
  var els = Array.prototype.slice.call(document.querySelectorAll('[data-reveal]'))
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target) } })
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.12 })
  els.forEach(function (el) {
    if (el.getBoundingClientRect().top > innerHeight) { el.classList.add('js-reveal'); io.observe(el) }
  })
})()
