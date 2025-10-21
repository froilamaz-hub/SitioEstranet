document.addEventListener("DOMContentLoaded", function () {
  const menuLinks = document.querySelectorAll(".nav-links a");
  const sections = document.querySelectorAll("section[id]");

  function setActiveLink(targetId) {
    menuLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${targetId}`) {
        link.classList.add("active");
      }
    });
  }

  function updateActiveMenu() {
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    // Caso 1: Parte superior = HOME
    if (scrollY < 200) {
      setActiveLink("inicio");
      return;
    }

    // Caso 2: Final de página = DÓNDE ESTAMOS
    if (scrollY + windowHeight >= documentHeight - 50) {
      setActiveLink("ubicacion");
      return;
    }

    // Caso 3: Detectar sección actual
    let currentSection = "inicio";
    let maxVisibleArea = 0;

    sections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      const sectionTop = rect.top;
      const sectionBottom = rect.bottom;
      const sectionHeight = rect.height;

      // Calcular cuánto de la sección está visible
      const visibleTop = Math.max(0, -sectionTop);
      const visibleBottom = Math.min(sectionHeight, windowHeight - sectionTop);
      const visibleArea = Math.max(0, visibleBottom - visibleTop);

      // Si esta sección tiene más área visible, es la activa
      if (visibleArea > maxVisibleArea) {
        maxVisibleArea = visibleArea;
        currentSection = section.id;
      }
    });

    setActiveLink(currentSection);
  }

  // Manejar clics
  menuLinks.forEach((link) => {
    link.addEventListener("click", function () {
      setTimeout(updateActiveMenu, 150);
    });
  });

  // Manejar scroll
  window.addEventListener("scroll", updateActiveMenu, { passive: true });

  // ESTADO INICIAL: HOME activo
  setActiveLink("inicio");
});

// === toggler menú hamburguesa con .nav-links) ===
(function () {
  const contenedor = document.querySelector(".navbar-contenedor");
  const burger = document.querySelector(".burger-btn");
  const menu = document.querySelector(".nav-links");
  if (!contenedor || !burger || !menu) return;

  const toggle = (open) => {
    contenedor.classList.toggle("nav-open", open);
    burger.classList.toggle("is-open", open);
    burger.setAttribute("aria-expanded", String(open));
  };

  burger.addEventListener("click", () => {
    const next = !burger.classList.contains("is-open");
    toggle(next);
  });

  // Cerrar al elegir una opción
  menu.addEventListener("click", (e) => {
    if (e.target.closest("a")) toggle(false);
  });

  // Cerrar con ESC
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") toggle(false);
  });
})();
