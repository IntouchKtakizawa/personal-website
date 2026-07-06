document.getElementById("year").textContent = new Date().getFullYear();

const roles = [
  "Theatre Tech Director",
  "Guitarist / Bassist / Drummer",
  "Music Producer",
  "Aspiring Biomedical & Aerospace Engineer",
  "Filmmaker",
];

const typedEl = document.getElementById("typed");
let roleIndex = 0;
let charIndex = 0;
let deleting = false;

function tick() {
  const current = roles[roleIndex];

  if (!deleting) {
    charIndex++;
    typedEl.textContent = current.slice(0, charIndex);
    if (charIndex === current.length) {
      deleting = true;
      setTimeout(tick, 1400);
      return;
    }
  } else {
    charIndex--;
    typedEl.textContent = current.slice(0, charIndex);
    if (charIndex === 0) {
      deleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
    }
  }

  setTimeout(tick, deleting ? 35 : 60);
}

tick();

document.querySelectorAll(".story-toggle").forEach((button) => {
  const content = button.nextElementSibling;
  button.addEventListener("click", () => {
    const isOpen = content.classList.toggle("is-open");
    button.setAttribute("aria-expanded", String(isOpen));
  });
});
