// =========================================================
//  ESTRANET SRL - Script Principal v3.0
//  SOLUCIÓN DEFINITIVA - Sin cálculos complejos
// =========================================================

document.addEventListener("DOMContentLoaded", function () {
  const menuLinks = document.querySelectorAll(".nav-links a");
  const sections = document.querySelectorAll("section[id], header[id]");

  // =========================================================
  //  FUNCIÓN: Activar link en el menú
  // =========================================================
  function setActiveLink(targetId) {
    menuLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${targetId}`) {
        link.classList.add("active");
      }
    });
  }

  // =========================================================
  //  INTERSECTION OBSERVER - Detectar secciones al scrollear
  // =========================================================
  const observerOptions = {
    root: null,
    rootMargin: "-50px 0px -66% 0px",
    threshold: 0,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        setActiveLink(entry.target.id);
        console.log("✅ Visible:", entry.target.id);
      }
    });
  }, observerOptions);

  sections.forEach((section) => {
    observer.observe(section);
  });

 // =========================================================
//  MANEJO DE CLICKS EN EL MENÚ - SCROLL ANIMADO
// =========================================================

// Función para scroll suave animado al clickear un link del nav 
function smoothScrollTo(targetPosition, duration = 1000) {
  const startPosition = window.pageYOffset;
  const distance = targetPosition - startPosition;
  let startTime = null;

  function animation(currentTime) {
    if (startTime === null) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const progress = Math.min(timeElapsed / duration, 1);
    
    // Easing function (ease-in-out)
    const ease = progress < 0.5
      ? 4 * progress * progress * progress
      : 1 - Math.pow(-2 * progress + 2, 3) / 2;
    
    window.scrollTo(0, startPosition + distance * ease);
    
    if (timeElapsed < duration) {
      requestAnimationFrame(animation);
    }
  }

  requestAnimationFrame(animation);
}

// Función para obtener el offset correcto según el tamaño de pantalla
function getScrollOffset() {
  if (window.innerWidth <= 768) {
    return 100; // Mobile: offset más pequeño
  } else if (window.innerWidth <= 1216) {
    return 120; // Tablet: offset intermedio
  } else {
    return 150; // Desktop: offset original
  }
}

menuLinks.forEach((link) => {
  link.addEventListener("click", function(e) {
    e.preventDefault();
    
    const href = this.getAttribute("href");
    const targetId = href.substring(1);
    const targetElement = document.querySelector(href);
    
    if (!targetElement) {
      console.error('❌ Elemento no encontrado:', href);
      return;
    }

    // Activar link inmediatamente
    setActiveLink(targetId);
    
    // Calcular posición con offset responsive
    const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
    const offset = getScrollOffset();
    const offsetPosition = elementPosition - offset;

    // Ejecutar scroll animado
    smoothScrollTo(offsetPosition, 1000);
    
    console.log('🖱️ Click en:', targetId, '| Offset:', offset + 'px');
  });
});

  // =========================================================
  //  LOGO (HOME)
  // =========================================================
const logo = document.querySelector('.logo-link');
if (logo) {
  logo.addEventListener('click', function(e) {
    e.preventDefault();
    setActiveLink('inicio');
    
    // Scroll suave hacia arriba
    smoothScrollTo(0, 1000);
    
    console.log('🏠 Navegando a HOME');
  });
}

// =========================================================
//  MENÚ HAMBURGUESA
// =========================================================

(function () {
  const contenedor = document.querySelector(".navbar-contenedor");
  const burger = document.querySelector(".burger-btn");
  const menu = document.querySelector(".nav-links");

  if (!contenedor || !burger || !menu) return;

  const toggle = (open) => {
    contenedor.classList.toggle("nav-open", open);
    burger.classList.toggle("is-open", open);
    burger.setAttribute("aria-expanded", String(open));

    if (window.innerWidth <= 768) {
      document.body.style.overflow = open ? "hidden" : "";
    }

    if (open) {
      setTimeout(() => {
        const firstLink = menu.querySelector("a");
        if (firstLink) firstLink.focus();
      }, 100);
    } else {
      burger.focus();
    }
  };

  burger.addEventListener("click", () => {
    toggle(!burger.classList.contains("is-open"));
  });

  menu.addEventListener("click", (e) => {
    if (e.target.closest("a")) {
      toggle(false);
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && contenedor.classList.contains("nav-open")) {
      toggle(false);
    }
  });

  document.addEventListener("click", (e) => {
    if (
      contenedor.classList.contains("nav-open") &&
      !contenedor.contains(e.target)
    ) {
      toggle(false);
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 768 && contenedor.classList.contains("nav-open")) {
      toggle(false);
    }
  });

  console.log("✅ Menú hamburguesa inicializado");
})();

// =========================================================
//  VALIDACIÓN DE FORMULARIO
// =========================================================

document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector(".formulario-contacto form");

  if (!form) return;

  function validarDNI(dni) {
    return /^\d{7,8}$/.test(dni.replace(/\D/g, ""));
  }

  function validarTelefono(telefono) {
    return /^\d{7,15}$/.test(telefono.replace(/[\s\-]/g, ""));
  }

  function validarEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function mostrarError(input, mensaje) {
    const errorAnterior = input.parentElement.querySelector(".error-message");
    if (errorAnterior) errorAnterior.remove();

    const errorDiv = document.createElement("div");
    errorDiv.className = "error-message";
    errorDiv.style.cssText = `
      color: #d32f2f;
      font-size: 1.2rem;
      margin-top: 5px;
      font-weight: 500;
    `;
    errorDiv.textContent = mensaje;

    input.style.borderColor = "#d32f2f";
    input.parentElement.appendChild(errorDiv);
  }

  function limpiarError(input) {
    const errorMsg = input.parentElement.querySelector(".error-message");
    if (errorMsg) errorMsg.remove();
    input.style.borderColor = "#e0e0e0";
  }

  const inputs = form.querySelectorAll("input, select, textarea");

  inputs.forEach((input) => {
    input.addEventListener("blur", function () {
      limpiarError(this);

      if (this.id === "documento" && this.value && !validarDNI(this.value)) {
        mostrarError(this, "El DNI debe tener 7 u 8 dígitos");
      }

      if (
        (this.id === "telefono" || this.id === "telefono-secundario") &&
        this.value &&
        !validarTelefono(this.value)
      ) {
        mostrarError(this, "Formato de teléfono inválido");
      }

      if (this.id === "email" && this.value && !validarEmail(this.value)) {
        mostrarError(this, "Email inválido");
      }
    });

    input.addEventListener("input", function () {
      if (this.parentElement.querySelector(".error-message")) {
        limpiarError(this);
      }
    });
  });

  form.addEventListener("submit", function (e) {
    let errores = [];

    inputs.forEach((input) => limpiarError(input));

    const dniInput = document.getElementById("documento");
    if (dniInput && dniInput.value && !validarDNI(dniInput.value)) {
      mostrarError(dniInput, "DNI debe tener 7 u 8 dígitos");
      errores.push("DNI");
    }

    const telInput = document.getElementById("telefono");
    if (telInput && telInput.value && !validarTelefono(telInput.value)) {
      mostrarError(telInput, "Teléfono inválido");
      errores.push("Teléfono");
    }

    const emailInput = document.getElementById("email");
    if (emailInput && emailInput.value && !validarEmail(emailInput.value)) {
      mostrarError(emailInput, "Email inválido");
      errores.push("Email");
    }

    form.querySelectorAll("[required]").forEach((campo) => {
      if (!campo.value.trim()) {
        mostrarError(campo, "Este campo es obligatorio");
        errores.push(campo.name || campo.id);
      }
    });

    if (errores.length > 0) {
      e.preventDefault();
      const primerError = form.querySelector(".error-message");
      if (primerError) {
        primerError.parentElement.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
      return false;
    }

    if (!confirm("¿Confirmar envío de datos?")) {
      e.preventDefault();
      return false;
    }

    const submitBtn = form.querySelector('input[type="submit"]');
    if (submitBtn) {
      submitBtn.value = "Enviando...";
      submitBtn.disabled = true;
    }
  });

  console.log("✅ Validación de formulario inicializada");
});

// =========================================================
//  AUTO-FORMATO DE INPUTS
// =========================================================

document.addEventListener("DOMContentLoaded", function () {
  const dniInput = document.getElementById("documento");
  if (dniInput) {
    dniInput.addEventListener("input", function () {
      this.value = this.value.replace(/\D/g, "").slice(0, 8);
    });
  }

  [
    document.getElementById("telefono"),
    document.getElementById("telefono-secundario"),
  ]
    .filter(Boolean)
    .forEach((input) => {
      input.addEventListener("input", function () {
        let valor = this.value.replace(/\D/g, "");
        if (valor.length > 3) {
          valor = valor.slice(0, 3) + "-" + valor.slice(3);
        }
        this.value = valor.slice(0, 12);
      });
    });

  [document.getElementById("nombre"), document.getElementById("apellidos")]
    .filter(Boolean)
    .forEach((input) => {
      input.addEventListener("blur", function () {
        this.value = this.value
          .toLowerCase()
          .split(" ")
          .map((palabra) => palabra.charAt(0).toUpperCase() + palabra.slice(1))
          .join(" ");
      });
    });

  const emailInput = document.getElementById("email");
  if (emailInput) {
    emailInput.addEventListener("blur", function () {
      this.value = this.value.toLowerCase().trim();
    });
  }
});

// =========================================================
//  TRACKING DE WHATSAPP
// =========================================================

document.addEventListener("DOMContentLoaded", function () {
  const botonesWA = document.querySelectorAll(
    '.button-contratar a, a[href*="wa.me"]'
  );
  botonesWA.forEach((boton) => {
    boton.addEventListener("click", function () {
      const servicio =
        this.closest(".tarjeta-servicios")?.querySelector(".titulo-destacado")
          ?.textContent || "Consulta general";
      console.log("📱 WhatsApp:", servicio);
    });
  });
});

console.log(
  "%c🌐 Estranet SRL",
  "font-size: 18px; color: #0066cc; font-weight: bold;"
);
});
