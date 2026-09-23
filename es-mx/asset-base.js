/**
 * Fixes product/logo URLs when an old cached bundle still requests /products/ at the
 * github.io site root (outside the project Pages path).
 */
(function () {
  var match = location.pathname.match(/^(.*\/es-mx)(?:\/|$)/);
  if (!match) return;
  var base = match[1];

  function rewrite(url) {
    if (!url || typeof url !== "string") return url;
    if (url.indexOf(base + "/products/") === 0) return url;
    if (url.indexOf("/products/") === 0) return base + url;
    if (url === "/ambev-partner-logo.png") return base + "/ambev-partner-logo.png";
    if (url === "/bees-one-logo.svg") return base + "/bees-one-logo.svg";
    try {
      var u = new URL(url, location.origin);
      if (u.origin === location.origin && u.pathname.indexOf("/products/") === 0) {
        return base + u.pathname + u.search;
      }
    } catch (e) {
      /* ignore */
    }
    return url;
  }

  function fixImages(root) {
    root.querySelectorAll("img[src]").forEach(function (img) {
      var next = rewrite(img.getAttribute("src"));
      if (next && next !== img.getAttribute("src")) img.setAttribute("src", next);
    });
  }

  var observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (m) {
      if (m.type === "attributes" && m.target.tagName === "IMG" && m.attributeName === "src") {
        var img = m.target;
        var next = rewrite(img.getAttribute("src"));
        if (next && next !== img.getAttribute("src")) img.setAttribute("src", next);
      }
      if (m.type === "childList") {
        m.addedNodes.forEach(function (node) {
          if (node.nodeType !== 1) return;
          if (node.tagName === "IMG") fixImages(node.parentNode || document);
          else fixImages(node);
        });
      }
    });
  });

  document.addEventListener("DOMContentLoaded", function () {
    fixImages(document);
    observer.observe(document.documentElement, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ["src"],
    });
  });
})();
