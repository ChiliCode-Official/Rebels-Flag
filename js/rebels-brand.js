// Permanent Observer and Live Sync Engine for Rebels Flag
// Locks down team names, scores, ticker, and logo against React hydration rewrites
(function() {
  let isUpdating = false;

  function forceRebelsData() {
    if (isUpdating) return;
    isUpdating = true;

    try {
      const stored = localStorage.getItem("rebels_sports_data");
      let data = null;
      if (stored) {
        try { data = JSON.parse(stored); } catch(e) {}
      }
      if (!data && window.SportsDB) {
        data = window.SportsDB.defaultData;
      }

      // 1. Force Logo to Rebels
      const logoImgs = document.querySelectorAll('img[alt="Logo"], [data-framer-name="Logo"] img, [data-framer-name="Default"] img');
      logoImgs.forEach(img => {
        if (!img.src.includes('CzsOIJwqb89O7Pr6zp3W1BNGXNs.svg')) {
          img.src = './framerusercontent.com/images/CzsOIJwqb89O7Pr6zp3W1BNGXNs.svg';
        }
        img.style.maxWidth = '140px';
        img.style.width = 'auto';
        img.style.height = '24px';
      });

      if (data && data.nextMatch) {
        const team1 = data.nextMatch.team1 ? data.nextMatch.team1.name : "Rebels";
        const team2 = data.nextMatch.team2 ? data.nextMatch.team2.name : "Sky Strikers";
        const ticker = data.nextMatch.tickerText || `Next: ${team1} vs ${team2}`;

        // 2. Lock Ticker
        document.querySelectorAll('p, span, a').forEach(el => {
          if (el.textContent.includes('Tigers vs Flash Flames') || el.textContent.includes('Next:')) {
            if (el.children.length === 0 && el.textContent !== ticker) {
              el.textContent = ticker;
            }
          }
        });

        // 3. Lock Next Match Teams
        document.querySelectorAll('h1, h2, h3, h4, p').forEach(el => {
          const txt = el.textContent.trim();
          if (txt === 'Conquerors Club' && txt !== team1) {
            el.textContent = team1;
          }
          if (txt === 'Sky Strikers' && team2 && txt !== team2 && el.closest('#countdown-section, [data-framer-name*="Countdown"]')) {
            el.textContent = team2;
          }
        });

        // 4. Lock Olympiq mentions anywhere in text
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
        let node;
        while (node = walker.nextNode()) {
          if (node.nodeValue && /olympiq/i.test(node.nodeValue)) {
            node.nodeValue = node.nodeValue.replace(/olympiq/gi, 'Rebels');
          }
        }
      }
    } finally {
      isUpdating = false;
    }
  }

  // Run on load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', forceRebelsData);
  } else {
    forceRebelsData();
  }

  // Periodic safeguard
  setInterval(forceRebelsData, 400);

  // MutationObserver to immediately revert any React hydration overwrite
  const observer = new MutationObserver((mutations) => {
    if (isUpdating) return;
    for (const m of mutations) {
      if (m.type === 'childList' || m.type === 'characterData') {
        forceRebelsData();
        break;
      }
    }
  });

  document.addEventListener('DOMContentLoaded', () => {
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true
    });
  });

  // Also hook custom update events from admin panel
  window.addEventListener("sportsDataUpdated", forceRebelsData);
  window.addEventListener("storage", forceRebelsData);
})();
