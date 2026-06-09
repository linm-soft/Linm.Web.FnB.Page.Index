/** Resolve SEO MFE URLs — prod: site root; local demo: standalone Seo :9126 */
(function () {
  const isLocal = /^(localhost|127\.0\.0\.1)$/.test(window.location.hostname);
  window.LINM_SEO_BASE = isLocal ? 'http://localhost:9126' : '';
  window.linmSeoUrl = function (path) {
    const p = path.startsWith('/') ? path : '/' + path;
    return (window.LINM_SEO_BASE || '') + p;
  };
  function wire() {
    document.querySelectorAll('[data-seo-href]').forEach(function (el) {
      el.setAttribute('href', window.linmSeoUrl(el.getAttribute('data-seo-href')));
    });
    if (window.LINM_SEO_BASE) {
      document.querySelectorAll('a[href^="/pricing"], a[href="/"]').forEach(function (el) {
        if (!el.hasAttribute('data-seo-href')) {
          el.setAttribute('href', window.linmSeoUrl(el.getAttribute('href')));
        }
      });
    }
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', wire);
  } else {
    wire();
  }
})();
