// Live sync script for Olympiq / Rebels-Flag website
// Updates match cards, countdown, scoreboards, and ticker in real time
(function() {
  function formatCountdown(targetDateStr) {
    const target = new Date(targetDateStr).getTime();
    const now = new Date().getTime();
    const diff = target - now;

    if (diff <= 0) {
      return { days: "00", hours: "00", minutes: "00", seconds: "00", ended: true };
    }

    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((diff % (1000 * 60)) / 1000);

    return {
      days: String(d).padStart(2, '0'),
      hours: String(h).padStart(2, '0'),
      minutes: String(m).padStart(2, '0'),
      seconds: String(s).padStart(2, '0'),
      ended: false
    };
  }

  let sportsData = null;
  let countdownInterval = null;

  function updateCountdownDisplay() {
    if (!sportsData || !sportsData.nextMatch || !sportsData.nextMatch.matchDate) return;

    const cd = formatCountdown(sportsData.nextMatch.matchDate);

    // Update countdown spans if present
    const dayEls = document.querySelectorAll('[data-countdown="days"]');
    const hourEls = document.querySelectorAll('[data-countdown="hours"]');
    const minEls = document.querySelectorAll('[data-countdown="minutes"]');
    const secEls = document.querySelectorAll('[data-countdown="seconds"]');

    dayEls.forEach(el => el.textContent = cd.days);
    hourEls.forEach(el => el.textContent = cd.hours);
    minEls.forEach(el => el.textContent = cd.minutes);
    secEls.forEach(el => el.textContent = cd.seconds);

    // Also look for Framer text nodes that contain DAYS, HOURS, etc.
    const allP = document.querySelectorAll('p, span, h2, h3, h4');
    // If elements don't have data-countdown yet, find them by sibling labels
    allP.forEach(p => {
      const txt = p.textContent.trim();
      if (txt === 'DAYS') {
        const prev = p.previousElementSibling || p.parentElement.querySelector('h1, h2, h3, p');
        if (prev && prev !== p && /^\d+$/.test(prev.textContent.trim())) {
          prev.setAttribute('data-countdown', 'days');
          prev.textContent = cd.days;
        }
      } else if (txt === 'HOURS') {
        const prev = p.previousElementSibling || p.parentElement.querySelector('h1, h2, h3, p');
        if (prev && prev !== p && /^\d+$/.test(prev.textContent.trim())) {
          prev.setAttribute('data-countdown', 'hours');
          prev.textContent = cd.hours;
        }
      } else if (txt === 'MINUTES') {
        const prev = p.previousElementSibling || p.parentElement.querySelector('h1, h2, h3, p');
        if (prev && prev !== p && /^\d+$/.test(prev.textContent.trim())) {
          prev.setAttribute('data-countdown', 'minutes');
          prev.textContent = cd.minutes;
        }
      } else if (txt === 'SECONDS') {
        const prev = p.previousElementSibling || p.parentElement.querySelector('h1, h2, h3, p');
        if (prev && prev !== p && /^\d+$/.test(prev.textContent.trim())) {
          prev.setAttribute('data-countdown', 'seconds');
          prev.textContent = cd.seconds;
        }
      }
    });
  }

  function applySportsData(data) {
    sportsData = data;
    if (!sportsData) return;

    // 1. Ticker / Header text update
    if (sportsData.nextMatch && sportsData.nextMatch.tickerText) {
      const tickerEls = document.querySelectorAll('p, span');
      tickerEls.forEach(el => {
        if (el.textContent.includes('Tigers vs Flash Flames') || el.hasAttribute('data-live-ticker')) {
          el.setAttribute('data-live-ticker', 'true');
          el.textContent = sportsData.nextMatch.tickerText;
        }
      });
    }

    // 2. Next Match Teams
    if (sportsData.nextMatch) {
      const t1 = sportsData.nextMatch.team1 ? sportsData.nextMatch.team1.name : null;
      const t2 = sportsData.nextMatch.team2 ? sportsData.nextMatch.team2.name : null;

      if (t1) {
        document.querySelectorAll('h2, h3, p').forEach(el => {
          if (el.textContent.trim() === 'Conquerors Club' || el.hasAttribute('data-next-team1')) {
            el.setAttribute('data-next-team1', 'true');
            el.textContent = t1;
          }
        });
      }
      if (t2) {
        document.querySelectorAll('h2, h3, p').forEach(el => {
          if (el.textContent.trim() === 'Sky Strikers' || el.hasAttribute('data-next-team2')) {
            el.setAttribute('data-next-team2', 'true');
            el.textContent = t2;
          }
        });
      }
    }

    // 3. Live Score Badge (if active)
    let liveBadge = document.getElementById('rebels-live-scoreboard');
    if (sportsData.liveScore && sportsData.liveScore.isLive) {
      if (!liveBadge) {
        liveBadge = document.createElement('div');
        liveBadge.id = 'rebels-live-scoreboard';
        liveBadge.innerHTML = `
          <div class="live-pulse"></div>
          <span class="live-title">LIVE:</span>
          <span class="live-t1">${sportsData.nextMatch.team1.name} <strong>${sportsData.liveScore.team1Score}</strong></span>
          <span class="live-vs">-</span>
          <span class="live-t2"><strong>${sportsData.liveScore.team2Score}</strong> ${sportsData.nextMatch.team2.name}</span>
          <span class="live-period">(${sportsData.liveScore.period})</span>
        `;
        document.body.appendChild(liveBadge);
      } else {
        liveBadge.querySelector('.live-t1').innerHTML = `${sportsData.nextMatch.team1.name} <strong>${sportsData.liveScore.team1Score}</strong>`;
        liveBadge.querySelector('.live-t2').innerHTML = `<strong>${sportsData.liveScore.team2Score}</strong> ${sportsData.nextMatch.team2.name}`;
        liveBadge.querySelector('.live-period').textContent = `(${sportsData.liveScore.period})`;
      }
      liveBadge.style.display = 'flex';
    } else if (liveBadge) {
      liveBadge.style.display = 'none';
    }

    // 4. Update countdown timer
    updateCountdownDisplay();
    if (!countdownInterval) {
      countdownInterval = setInterval(updateCountdownDisplay, 1000);
    }
  }

  // Inject styles for the live scoreboard floating banner
  const style = document.createElement('style');
  style.textContent = `
    #rebels-live-scoreboard {
      position: fixed;
      bottom: 24px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(14, 14, 14, 0.94);
      backdrop-filter: blur(12px);
      border: 1px solid #c7f849;
      box-shadow: 0 10px 35px rgba(199, 248, 73, 0.25);
      color: #ffffff;
      padding: 10px 22px;
      border-radius: 9999px;
      display: none;
      align-items: center;
      gap: 12px;
      font-family: 'DM Sans', 'Inter', sans-serif;
      font-size: 14px;
      z-index: 999999;
      animation: bounceIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
    .live-pulse {
      width: 10px;
      height: 10px;
      background: #ff3d3d;
      border-radius: 50%;
      box-shadow: 0 0 0 rgba(255, 61, 61, 0.7);
      animation: pulse 1.6s infinite;
    }
    @keyframes pulse {
      0% { box-shadow: 0 0 0 0 rgba(255, 61, 61, 0.7); }
      70% { box-shadow: 0 0 0 10px rgba(255, 61, 61, 0); }
      100% { box-shadow: 0 0 0 0 rgba(255, 61, 61, 0); }
    }
    @keyframes bounceIn {
      0% { transform: translate(-50%, 60px); opacity: 0; }
      100% { transform: translate(-50%, 0); opacity: 1; }
    }
    #rebels-live-scoreboard .live-title {
      color: #c7f849;
      font-weight: 800;
      letter-spacing: 0.05em;
    }
    #rebels-live-scoreboard strong {
      color: #c7f849;
      font-size: 16px;
      font-family: 'Bricolage Grotesque', sans-serif;
    }
    #rebels-live-scoreboard .live-period {
      color: #8f8f8f;
      font-size: 12px;
    }
    /* Mobile responsive */
    @media (max-width: 600px) {
      #rebels-live-scoreboard {
        bottom: 16px;
        width: 90%;
        font-size: 12px;
        padding: 8px 14px;
        justify-content: center;
      }
    }
  `;
  document.head.appendChild(style);

  // Initialize data
  document.addEventListener('DOMContentLoaded', async () => {
    if (window.SportsDB) {
      const data = await window.SportsDB.getData();
      applySportsData(data);
      window.SportsDB.subscribe(applySportsData);
    }
  });

  // Fallback if DOM already loaded
  if (document.readyState === 'interactive' || document.readyState === 'complete') {
    if (window.SportsDB) {
      window.SportsDB.getData().then(applySportsData);
      window.SportsDB.subscribe(applySportsData);
    }
  }
})();
