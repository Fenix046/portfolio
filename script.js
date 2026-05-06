/* ====================== NAVBAR SCROLL ====================== */
const nav = document.getElementById('siteNav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });

/* ====================== MOBILE MENU ====================== */
const burger = document.getElementById('navBurger');
const mobileMenu = document.getElementById('mobileMenu');

burger.addEventListener('click', () => {
  const open = mobileMenu.classList.toggle('open');
  burger.setAttribute('aria-expanded', open);
  document.body.style.overflow = open ? 'hidden' : '';
});

mobileMenu.querySelectorAll('.mob-link').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  });
});

/* ====================== SMOOTH SCROLL ====================== */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    window.scrollTo({
      top: target.getBoundingClientRect().top + window.scrollY - 70,
      behavior: 'smooth'
    });
  });
});

/* ====================== SCROLL REVEAL ====================== */
const revealItems = document.querySelectorAll('.reveal-item');

const revealObs = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('in-view'), i * 70);
      revealObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

revealItems.forEach(el => revealObs.observe(el));

/* ====================== SKILL BARS ====================== */
const skillSection = document.getElementById('skills');
if (skillSection) {
  const barObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.sk-bar-fill').forEach(fill => {
          setTimeout(() => {
            fill.style.width = fill.getAttribute('data-w') + '%';
          }, 300);
        });
        barObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  barObs.observe(skillSection);
}

/* ====================== GITHUB PROJECTS ====================== */
const username = 'Fenix046';
const projGrid = document.getElementById('github-projects');
const projLoader = document.getElementById('projLoader');

const langColors = {
  PHP: '#7f70d6',
  JavaScript: '#f5c518',
  HTML: '#e06820',
  CSS: '#38bdf8',
};

fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`)
  .then(r => {
    if (!r.ok) throw new Error('API error');
    return r.json();
  })
  .then(repos => {
    if (projLoader) projLoader.remove();

    const filtered = repos
      .filter(r => !r.fork && r.name !== username && (r.language === 'PHP' || r.language === 'JavaScript'))
      .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
      .slice(0, 6);

    if (!filtered.length) {
      projGrid.innerHTML = `<p style="color:var(--muted);padding:3rem 0;">No public projects found matching filter.</p>`;
      return;
    }

    filtered.forEach((repo, i) => {
      const color = langColors[repo.language] || '#c4560a';
      const desc = repo.description || 'No description available.';
      const card = document.createElement('div');
      card.className = 'proj-card reveal-item';
      card.style.transitionDelay = `${i * 0.07}s`;
      card.innerHTML = `
        <div class="pc-top">
          <i class="bi bi-github pc-icon"></i>
          <span class="pc-lang">
            <span class="lang-blob" style="background:${color}"></span>
            ${repo.language}
          </span>
        </div>
        <h4 class="pc-name">${repo.name}</h4>
        <p class="pc-desc">${desc.length > 110 ? desc.slice(0, 110) + '…' : desc}</p>
        <div class="pc-links">
          <a href="${repo.html_url}" target="_blank" rel="noopener" class="pc-btn pc-btn-main">
            <i class="bi bi-box-arrow-up-right me-1"></i> View Code
          </a>
          <a href="${repo.html_url}/archive/refs/heads/main.zip" class="pc-btn pc-btn-sec">
            <i class="bi bi-download me-1"></i> ZIP
          </a>
        </div>
      `;
      projGrid.appendChild(card);
      setTimeout(() => revealObs.observe(card), 50);
    });
  })
  .catch(() => {
    if (projLoader) projLoader.remove();
    projGrid.innerHTML = `<p style="color:var(--muted);padding:3rem 0;">Failed to load projects. Check back later.</p>`;
  });

/* ====================== FOOTER YEAR ====================== */
const yr = document.getElementById('year');
if (yr) yr.textContent = new Date().getFullYear();
