// Ensure Rebels branding is applied smoothly across all rendered elements and logos
(function() {
  function enforceRebelsBranding() {
    // 1. Replace any remaining Olympiq text
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
    let node;
    while (node = walker.nextNode()) {
      if (node.nodeValue && /olympiq/i.test(node.nodeValue)) {
        node.nodeValue = node.nodeValue.replace(/olympiq/gi, 'Rebels');
      }
    }

    // 2. Update all header / footer logo containers to display REBELS clearly
    const logos = document.querySelectorAll('img[alt="Logo"], [data-framer-name="Logo"], [data-framer-name="Default"]');
    logos.forEach(el => {
      if (el.tagName === 'IMG') {
        el.src = el.src.replace(/CzsOIJwqb89O7Pr6zp3W1BNGXNs\.svg.*/, 'CzsOIJwqb89O7Pr6zp3W1BNGXNs.svg');
        el.style.maxWidth = '140px';
        el.style.width = 'auto';
        el.style.height = '24px';
      }
    });

    // Replace brand text elements if any
    document.querySelectorAll('a, p, span, h1, h2, h3').forEach(el => {
      if (el.textContent.trim() === 'OLYMPIQ' || el.textContent.trim() === 'Olympiq') {
        el.textContent = 'REBELS';
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', enforceRebelsBranding);
  } else {
    enforceRebelsBranding();
  }
  setTimeout(enforceRebelsBranding, 500);
  setTimeout(enforceRebelsBranding, 1500);
})();
