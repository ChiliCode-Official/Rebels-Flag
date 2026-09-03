// Permanent Observer and Live Sync Engine for Rebels Flag (Español & Tocho Bandera)
(function() {
  let isUpdating = false;
  const HERO_PHRASE = "La rebeldía es un síntoma de inteligencia";

  // Diccionario de traducciones en tiempo real para neutralizar sobreescrituras de React
  const TEXT_REPLACEMENTS = [
    { from: /^About Us$/i, to: "Nosotros" },
    { from: /^Table$/i, to: "Tabla" },
    { from: /^Tickets$/i, to: "Boletos" },
    { from: /^News$/i, to: "Noticias" },
    { from: /^All Pages$/i, to: "Páginas" },
    { from: /^Get in Touch$/i, to: "Contacto" },
    { from: /^Book Tickets$/i, to: "Boletos" },
    { from: /^About Company$/i, to: "Sobre el Club" },
    { from: /^Welcome to undefeated$/i, to: "Bienvenidos al territorio invicto" },
    { from: /^Drive\. Resilience\. Excellence\.$/i, to: HERO_PHRASE },
    { from: /^Conquerors Club$/i, to: "Rebels Flag" },
    { from: /^Conquerors$/i, to: "Rebels" },
    { from: /^Conquerors Club Wins$/i, to: "Victoria de Rebels" },
    { from: /^Future matches\.$/i, to: "Próximos Partidos." },
    { from: /^Latest matches results\.$/i, to: "Últimos Resultados." },
    { from: /^Giving up is simply not an option\.$/i, to: "Rendirse simplemente no es una opción." },
    { from: /^Club achievement make the history\.$/i, to: "Nuestros logros hacen la historia." },
    { from: /^Latest products from our new kit\.$/i, to: "Indumentaria y equipo oficial." },
    { from: /^We believe in our community\. Discover our latest news\.$/i, to: "Comunidad Rebels: Últimas noticias." },
    { from: /^Subscribe to our newsletter to be in touch with news\.$/i, to: "Suscríbete para recibir avisos de partidos de Rebels." },
    { from: /^Follow the action!$/i, to: "¡Sigue la acción!" },
    { from: /^Overview$/i, to: "General" },
    { from: /^Club$/i, to: "El Club" },
    { from: /^Contacts$/i, to: "Contacto" },
    { from: /^DAYS$/i, to: "DÍAS" },
    { from: /^HOURS$/i, to: "HORAS" },
    { from: /^MINUTES$/i, to: "MINUTOS" },
    { from: /^SECONDS$/i, to: "SEGUNDOS" }
  ];

  function translateDomNodes() {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
    let node;
    while (node = walker.nextNode()) {
      const val = node.nodeValue ? node.nodeValue.trim() : "";
      if (!val) continue;

      if (/olympiq/i.test(val)) {
        node.nodeValue = node.nodeValue.replace(/olympiq/gi, 'Rebels');
      }

      for (const item of TEXT_REPLACEMENTS) {
        if (item.from.test(val)) {
          node.nodeValue = node.nodeValue.replace(item.from, item.to);
          break;
        }
      }
    }
  }

  function forceRebelsData() {
    if (isUpdating) return;
    isUpdating = true;

    try {
      // 1. Force Hero Title
      document.querySelectorAll('h1').forEach(h1 => {
        if (h1.textContent.includes('Drive') || h1.textContent.includes('rebeldía') || h1.hasAttribute('data-rebels-hero')) {
          h1.setAttribute('data-rebels-hero', 'true');
          if (h1.innerHTML !== HERO_PHRASE) {
            h1.innerHTML = `La rebeldía es un síntoma de <span style="color:#00d2ff;">inteligencia.</span>`;
          }
        }
      });

      // 2. Force Hero Image
      const heroImgs = document.querySelectorAll('img[src*="N46VmTbjE2Nhpi1AMmSeZjHc"], img[src*="rL3HbWLpFXWyqLlchpyseDYtY"], img[data-framer-name*="Image"] img');
      heroImgs.forEach(img => {
        if (!img.src.includes('rebels_hero.jpg')) {
          img.src = './framerusercontent.com/images/rebels_hero.jpg';
        }
      });

      // 3. Force Official Logo Image (logo_rebel.png)
      const logoImgs = document.querySelectorAll('img[alt="Logo"], [data-framer-name="Logo"] img, [data-framer-name="Default"] img');
      logoImgs.forEach(img => {
        if (!img.src.includes('logo_rebel.png')) {
          img.src = './framerusercontent.com/images/logo_rebel.png';
        }
        img.style.maxHeight = '42px';
        img.style.width = 'auto';
        img.style.objectFit = 'contain';
      });

      // 4. Force Ticker & Teams
      const stored = localStorage.getItem("rebels_sports_data");
      let data = null;
      if (stored) {
        try { data = JSON.parse(stored); } catch(e) {}
      }
      if (!data && window.SportsDB) {
        data = window.SportsDB.defaultData;
      }

      if (data && data.nextMatch) {
        const team1 = data.nextMatch.team1 ? data.nextMatch.team1.name : "Rebels";
        const team2 = data.nextMatch.team2 ? data.nextMatch.team2.name : "Sky Strikers";
        const ticker = data.nextMatch.tickerText || `Próximo: ${team1} vs ${team2}`;

        document.querySelectorAll('p, span, a').forEach(el => {
          if (el.textContent.includes('Tigers vs Flash Flames') || el.textContent.includes('Next:') || el.textContent.includes('Próximo:')) {
            if (el.children.length === 0 && el.textContent !== ticker) {
              el.textContent = ticker;
            }
          }
        });
      }

      // 5. Run DOM text translations
      translateDomNodes();
    } finally {
      isUpdating = false;
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', forceRebelsData);
  } else {
    forceRebelsData();
  }

  setInterval(forceRebelsData, 350);

  const observer = new MutationObserver(() => {
    if (!isUpdating) forceRebelsData();
  });

  document.addEventListener('DOMContentLoaded', () => {
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true
    });
  });

  window.addEventListener("sportsDataUpdated", forceRebelsData);
  window.addEventListener("storage", forceRebelsData);
})();
