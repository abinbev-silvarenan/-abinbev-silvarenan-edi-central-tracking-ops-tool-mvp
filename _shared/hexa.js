/**
 * hexa.js — runtime helpers for the Hexa design system port.
 *
 * Provides:
 *   - <hexa-icon name="CartIcon"></hexa-icon>           → inlines the SVG
 *   - <hexa-illustration name="EmptyBox"></hexa-illustration>  → inlines the SVG
 *   - window.Hexa.icon(name) and window.Hexa.illustration(name) for programmatic use
 *
 * Lazily loads icons.json / illustrations.json from this directory.
 */
(function () {
  'use strict';

  const here = (function () {
    const s = document.currentScript;
    const url = s ? s.src : (location.pathname + 'hexa.js');
    return url.replace(/[^/]+$/, '');
  })();

  const cache = { icons: null, illustrations: null };
  const inflight = {};

  function load(kind) {
    if (cache[kind]) return Promise.resolve(cache[kind]);
    if (inflight[kind]) return inflight[kind];
    inflight[kind] = fetch(here + kind + '.json')
      .then((r) => r.json())
      .then((j) => { cache[kind] = j; return j; })
      .catch((e) => { console.warn('[hexa] failed to load ' + kind, e); return {}; });
    return inflight[kind];
  }

  function makeIcon(svg, size, color) {
    const wrap = document.createElement('span');
    wrap.className = 'hexa-icon';
    wrap.innerHTML = svg;
    if (size) {
      wrap.style.width = typeof size === 'number' ? size + 'px' : size;
      wrap.style.height = typeof size === 'number' ? size + 'px' : size;
    }
    if (color) wrap.style.color = color;
    const inner = wrap.querySelector('svg');
    if (inner) {
      inner.setAttribute('width', '100%');
      inner.setAttribute('height', '100%');
      inner.setAttribute('aria-hidden', 'true');
      inner.setAttribute('focusable', 'false');
    }
    return wrap;
  }

  function upgradeIconElement(el) {
    if (el.dataset.hexaUpgraded === '1') return;
    el.dataset.hexaUpgraded = '1';
    const name = el.getAttribute('name');
    if (!name) return;
    load('icons').then((all) => {
      const entry = all[name] || all[name + 'Icon'];
      if (!entry) {
        el.textContent = '?';
        el.title = 'Icon not found: ' + name;
        return;
      }
      el.innerHTML = entry.svg || entry;
      const inner = el.querySelector('svg');
      if (inner) {
        inner.setAttribute('width', '100%');
        inner.setAttribute('height', '100%');
        inner.setAttribute('aria-hidden', el.getAttribute('aria-label') ? 'false' : 'true');
        inner.setAttribute('focusable', 'false');
      }
      const size = el.getAttribute('size');
      if (size) { el.style.width = size + 'px'; el.style.height = size + 'px'; }
    });
  }

  function upgradeIllustrationElement(el) {
    if (el.dataset.hexaUpgraded === '1') return;
    el.dataset.hexaUpgraded = '1';
    const name = el.getAttribute('name');
    if (!name) return;
    load('illustrations').then((all) => {
      const raw = all[name];
      if (!raw) {
        el.textContent = '';
        el.title = 'Illustration not found: ' + name;
        return;
      }
      // raw is just the inner svg children — wrap with proper svg tag.
      const vb = name === 'EmptyBox' ? '0 0 200 200' : '0 0 200 200'; // both viewBoxes are 200; keep simple
      el.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="' + vb + '" width="100%" height="100%" aria-hidden="true" focusable="false">' + raw + '</svg>';
      const w = el.getAttribute('size') || el.getAttribute('width');
      if (w) el.style.width = (typeof w === 'string' && w.endsWith('px') ? w : w + 'px');
    });
  }

  // Custom elements (no shadow DOM so styles cascade naturally)
  class HexaIcon extends HTMLElement {
    connectedCallback() { upgradeIconElement(this); }
    static get observedAttributes() { return ['name', 'size']; }
    attributeChangedCallback() { this.dataset.hexaUpgraded = ''; upgradeIconElement(this); }
  }
  class HexaIllustration extends HTMLElement {
    connectedCallback() { upgradeIllustrationElement(this); }
    static get observedAttributes() { return ['name', 'size']; }
    attributeChangedCallback() { this.dataset.hexaUpgraded = ''; upgradeIllustrationElement(this); }
  }
  if (!customElements.get('hexa-icon')) customElements.define('hexa-icon', HexaIcon);
  if (!customElements.get('hexa-illustration')) customElements.define('hexa-illustration', HexaIllustration);

  // Imperative API
  window.Hexa = {
    icon(name, opts) {
      return load('icons').then((all) => {
        const e = all[name] || all[name + 'Icon'];
        return e ? makeIcon(e.svg || e, opts?.size, opts?.color) : null;
      });
    },
    illustration(name, opts) {
      return load('illustrations').then((all) => {
        const raw = all[name];
        if (!raw) return null;
        const wrap = document.createElement('span');
        wrap.className = 'hexa-illustration';
        wrap.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">' + raw + '</svg>';
        if (opts?.size) { wrap.style.width = opts.size + 'px'; wrap.style.height = opts.size + 'px'; }
        return wrap;
      });
    },
    listIcons() { return load('icons').then(Object.keys); },
    listIllustrations() { return load('illustrations').then(Object.keys); },
  };
})();
