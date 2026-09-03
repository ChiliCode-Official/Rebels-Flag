// Live sync script for Rebels Flag (Clean & Safe)
(function() {
  function formatCountdown(targetDateStr) {
    const target = new Date(targetDateStr).getTime();
    const now = new Date().getTime();
    const diff = target - now;

    if (diff <= 0) {
      return { days: "00", hours: "00", minutes: "00", seconds: "00" };
    }

    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((diff % (1000 * 60)) / 1000);

    return {
      days: String(d).padStart(2, '0'),
      hours: String(h).padStart(2, '0'),
      minutes: String(m).padStart(2, '0'),
      seconds: String(s).padStart(2, '0')
    };
  }

  let sportsData = null;

  function updateCountdown() {
    if (!sportsData || !sportsData.nextMatch || !sportsData.nextMatch.matchDate) return;
    const cd = formatCountdown(sportsData.nextMatch.matchDate);
    const dayEls = document.querySelectorAll('[data-countdown="days"]');
    const hourEls = document.querySelectorAll('[data-countdown="hours"]');
    const minEls = document.querySelectorAll('[data-countdown="minutes"]');
    const secEls = document.querySelectorAll('[data-countdown="seconds"]');

    dayEls.forEach(el => el.textContent = cd.days);
    hourEls.forEach(el => el.textContent = cd.hours);
    minEls.forEach(el => el.textContent = cd.minutes);
    secEls.forEach(el => el.textContent = cd.seconds);
  }

  function applyData(data) {
    sportsData = data;
    if (!sportsData) return;

    let liveBadge = document.getElementById('rebels-live-scoreboard');
    if (sportsData.liveScore && sportsData.liveScore.isLive) {
      if (!liveBadge) {
        liveBadge = document.createElement('div');
        liveBadge.id = 'rebels-live-scoreboard';
        liveBadge.innerHTML = `
          <div class="live-pulse"></div>
          <span class="live-title">EN VIVO:</span>
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

    updateCountdown();
  }

  document.addEventListener('DOMContentLoaded', async () => {
    if (window.SportsDB) {
      const data = await window.SportsDB.getData();
      applyData(data);
      window.SportsDB.subscribe(applyData);
      setInterval(updateCountdown, 1000);
    }
  });
})();
