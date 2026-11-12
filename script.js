// Footer year
document.getElementById("year").textContent = new Date().getFullYear();

// Dark mode toggle (remembered per browser)
const themeBtn = document.querySelector(".theme-btn");
try {
  if (localStorage.getItem("theme") === "dark") document.documentElement.dataset.theme = "dark";
} catch (e) {}
themeBtn.addEventListener("click", () => {
  const dark = document.documentElement.dataset.theme !== "dark";
  document.documentElement.dataset.theme = dark ? "dark" : "light";
  try { localStorage.setItem("theme", dark ? "dark" : "light"); } catch (e) {}
});

// Mobile menu
const menuBtn = document.querySelector(".menu-btn");
const links = document.querySelector(".links");
menuBtn.addEventListener("click", () => {
  const open = links.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", open);
});
links.querySelectorAll("a").forEach(a => a.addEventListener("click", () => links.classList.remove("open")));

// Typing effect
const typed = document.querySelector(".typed");
const words = typed.dataset.words.split("|");
let w = 0, c = 0, deleting = false;
function type() {
  const word = words[w];
  typed.textContent = word.slice(0, c);
  if (!deleting && c < word.length) c++;
  else if (deleting && c > 0) c--;
  else if (!deleting) { deleting = true; return setTimeout(type, 1500); }
  else { deleting = false; w = (w + 1) % words.length; }
  setTimeout(type, deleting ? 40 : 80);
}
type();

// Reveal sections and fill skill bars on scroll
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add("visible");
    entry.target.querySelectorAll(".bar").forEach(b => b.classList.add("filled"));
    observer.unobserve(entry.target);
  });
}, { threshold: 0.15 });
document.querySelectorAll(".reveal").forEach(el => observer.observe(el));

// Live network timing using the Navigation Timing API
window.addEventListener("load", () => {
  setTimeout(() => {
    const nav = performance.getEntriesByType("navigation")[0];
    const ms = v => `${v.toFixed(1)} ms`;
    document.getElementById("ni-url").textContent = location.href;
    if (!nav) return;
    document.getElementById("ni-proto").textContent = nav.nextHopProtocol || "unknown";
    document.getElementById("ni-dns").textContent = ms(nav.domainLookupEnd - nav.domainLookupStart);
    document.getElementById("ni-tcp").textContent = ms(nav.connectEnd - nav.connectStart);
    document.getElementById("ni-ttfb").textContent = ms(nav.responseStart - nav.requestStart);
    document.getElementById("ni-load").textContent = ms(nav.loadEventStart - nav.startTime);
  }, 0);
});
