// Motor optimizado y ligero para Rebels Flag (CERO bucles infinitos)
(function() {
  const HERO_PHRASE = "La rebeldía es un síntoma de inteligencia";

  // Diccionario puntual para elementos clave sin tocar todo el DOM
  const TRANSLATIONS = {
    "About Us": "Nosotros",
    "Table": "Tabla",
    "Tickets": "Boletos",
    "News": "Noticias",
    "All Pages": "Páginas",
    "Get in Touch": "Contacto",
    "Book Tickets": "Boletos",
    "About Company": "Sobre el Club",
    "Welcome to undefeated": "Bienvenidos al territorio invicto",
    "Conquerors Club": "Rebels Flag",
    "Conquerors": "Rebels",
    "Future matches.": "Próximos Partidos.",
    "Latest matches results.": "Últimos Resultados.",
    "Giving up is simply not an option.": "Rendirse simplemente no es una opción.",
    "Club achievement make the history.": "Nuestros logros hacen la historia.",
    "Latest products from our new kit.": "Indumentaria y equipo oficial.",
    "DAYS": "DÍAS",
    "HOURS": "HORAS",
    "MINUTES": "MINUTOS",
    "SECONDS": "SEGUNDOS"
  };

  function applyCustomizations() {
    // 1. Hero Text
    const h1 = document.querySelector('h1');
    if (h1 && !h1.dataset.rebelsHero) {
      h1.dataset.rebelsHero = "true";
      h1.innerHTML = `La rebeldía es un síntoma de <span style="color:#00d2ff;">inteligencia.</span>`;
    }

    // 2. Hero Image
    const heroImgs = document.querySelectorAll('img[src*="N46VmTbjE2Nhpi1AMmSeZjHc"], img[src*="rL3HbWLpFXWyqLlchpyseDYtY"]');
    heroImgs.forEach(img => {
      if (!img.src.includes('rebels_hero.jpg')) {
        img.src = './framerusercontent.com/images/rebels_hero.jpg';
      }
    });

    // 3. Logo
    const logoImgs = document.querySelectorAll('img[alt="Logo"], [data-framer-name="Logo"] img, [data-framer-name="Default"] img');
    logoImgs.forEach(img => {
      if (!img.src.includes('logo_rebel.png')) {
        img.src = './framerusercontent.com/images/logo_rebel.png';
      }
      img.style.maxHeight = '42px';
      img.style.width = 'auto';
      img.style.objectFit = 'contain';
    });

    // 4. Selective translation (only buttons and titles, avoids tree walker infinite loops)
    document.querySelectorAll('a, button, p, span, h2, h3, h4').forEach(el => {
      if (el.children.length === 0) {
        const txt = el.textContent.trim();
        if (TRANSLATIONS[txt]) {
          el.textContent = TRANSLATIONS[txt];
        }
      }
    });
  }

  // Ejecutar solo en momentos clave
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyCustomizations);
  } else {
    applyCustomizations();
  }

  // Tres ejecuciones temporizadas seguras para cubrir la hidratación de React sin colgar la CPU
  setTimeout(applyCustomizations, 400);
  setTimeout(applyCustomizations, 1200);
  setTimeout(applyCustomizations, 2500);

  // Escuchar eventos de actualización desde el panel admin
  window.addEventListener("sportsDataUpdated", applyCustomizations);
})();
