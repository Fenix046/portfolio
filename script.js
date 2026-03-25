const roles = [
  "PHP Developer ",
  "Laravel Developer ",
  "Backend Engineer ",
  "SEO Optimizer ",
];

let i = 0,
  j = 0,
  current = "",
  deleting = false;

function type() {
  current = roles[i];

  document.querySelector(".typing").textContent = current.substring(
    0,
    deleting ? j-- : j++,
  );

  if (!deleting && j === current.length) {
    deleting = true;
    return setTimeout(type, 1000);
  }

  if (deleting && j === 0) {
    deleting = false;
    i = (i + 1) % roles.length;
  }

  setTimeout(type, deleting ? 50 : 100);
}

type();

/* Smooth scroll */
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    document
      .querySelector(this.getAttribute("href"))
      .scrollIntoView({ behavior: "smooth" });
  });
});

// ================= GITHUB PROJECT FETCH =================

const username = "Fenix046";

fetch(`https://api.github.com/users/${username}/repos`)
  .then((res) => res.json())
  .then((data) => {
    const container = document.getElementById("github-projects");

    // ❌ Remove unwanted repos
    const filtered = data.filter(
      (repo) =>
        !repo.fork &&
        repo.name !== username &&
        (repo.language === "PHP" || repo.language === "JavaScript"),
    );

    // ✅ Sort latest updated
    filtered.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));

    // ✅ Show only top 6
    filtered.slice(0, 6).forEach((repo) => {
      const project = `
        <div class="col-md-4">
          <div class="project-card p-4 h-100 text-center">

            <i class="bi bi-github fs-1"></i>

            <h5 class="mt-3">${repo.name}</h5>

            <p>
              ${repo.description ? repo.description : "No description available."}
            </p>

            <small class="text-info">
              ${repo.language ? repo.language : "Code Project"}
            </small>

            <div class="mt-3">
              <a href="${repo.html_url}" target="_blank" class="btn btn-primary btn-sm">
                View Code
              </a>

              <a href="${repo.html_url}/archive/refs/heads/main.zip"
                 class="btn btn-outline-light btn-sm">
                Download
              </a>
            </div>

          </div>
        </div>
      `;

      container.innerHTML += project;
    });

    // ❗ If no repos
    if (filtered.length === 0) {
      container.innerHTML = `<p class="text-center">No public projects found.</p>`;
    }
  })
  .catch((err) => {
    console.error("GitHub fetch error:", err);
  });
