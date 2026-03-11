"use strict";

(function () {
  const unitPhones = {
    guaratingueta: "551221030565",
    aparecida: "551230132177"
  };

  const unitNames = {
    guaratingueta: "Mr. Jones (Guaratinguetá)",
    aparecida: "Mr. Jones (Unidade Aparecida)"
  };

  const menuToggle = document.querySelector(".menu-toggle");
  const mobileNav = document.getElementById("mobile-nav");
  const mobileLinks = document.querySelectorAll(".mobile-nav a");
  const siteHeader = document.querySelector(".site-header");
  const yearEl = document.getElementById("year");
  const form = document.getElementById("booking-form");
  const feedback = document.getElementById("form-feedback");
  const dateInput = document.getElementById("data");

  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  if (menuToggle && mobileNav) {
    menuToggle.addEventListener("click", () => {
      const expanded = menuToggle.getAttribute("aria-expanded") === "true";
      menuToggle.setAttribute("aria-expanded", String(!expanded));
      mobileNav.classList.toggle("is-open");
    });

    mobileLinks.forEach((link) => {
      link.addEventListener("click", () => {
        mobileNav.classList.remove("is-open");
        menuToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  const motionReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!motionReduced) {
    let scrollTicking = false;
    const updateScrollEffects = () => {
      const scrollY = window.scrollY || window.pageYOffset || 0;
      const clamped = Math.min(scrollY, 1400);
      document.documentElement.style.setProperty("--scroll-shift", `${clamped}px`);

      if (siteHeader) {
        if (scrollY > 18) {
          siteHeader.classList.add("is-scrolled");
        } else {
          siteHeader.classList.remove("is-scrolled");
        }
      }
      scrollTicking = false;
    };

    updateScrollEffects();
    window.addEventListener(
      "scroll",
      () => {
        if (!scrollTicking) {
          window.requestAnimationFrame(updateScrollEffects);
          scrollTicking = true;
        }
      },
      { passive: true }
    );
  } else if (siteHeader) {
    const syncHeaderState = () => {
      if (window.scrollY > 18) {
        siteHeader.classList.add("is-scrolled");
      } else {
        siteHeader.classList.remove("is-scrolled");
      }
    };
    syncHeaderState();
    window.addEventListener("scroll", syncHeaderState, { passive: true });
  }

  if (dateInput) {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    dateInput.min = `${yyyy}-${mm}-${dd}`;

    dateInput.addEventListener("change", () => {
      if (!dateInput.value) {
        dateInput.setCustomValidity("");
        return;
      }
      const selected = new Date(`${dateInput.value}T12:00:00`);
      const day = selected.getDay();
      if (day === 0) {
        dateInput.setCustomValidity("Domingo indisponível. Escolha de segunda a sábado.");
      } else {
        dateInput.setCustomValidity("");
      }
      dateInput.reportValidity();
    });
  }

  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      clearFeedback();

      if (!form.checkValidity()) {
        form.reportValidity();
        setFeedback("Revise os campos obrigatórios antes de continuar.", "error");
        return;
      }

      const selectedDateRaw = (new FormData(form).get("data") || "").toString();
      if (selectedDateRaw) {
        const selectedDate = new Date(`${selectedDateRaw}T12:00:00`);
        if (selectedDate.getDay() === 0) {
          setFeedback("Domingo indisponível. Escolha de segunda a sábado.", "error");
          dateInput.focus();
          return;
        }
      }

      const formData = new FormData(form);
      const unidade = (formData.get("unidade") || "").toString();
      const phone = unitPhones[unidade];
      const unidadeLabel = unitNames[unidade] || unidade;

      if (!phone) {
        setFeedback("Não foi possível identificar a unidade selecionada.", "error");
        return;
      }

      const rawDate = (formData.get("data") || "").toString();
      const formattedDate = formatDateBR(rawDate);
      const nome = sanitizeLine(formData.get("nome"));
      const telefone = sanitizeLine(formData.get("telefone"));
      const servico = sanitizeLine(formData.get("servico"));
      const periodo = sanitizeLine(formData.get("periodo"));
      const observacoes = sanitizeLine(formData.get("observacoes"));

      const messageLines = [
        "Olá! Quero confirmar meu pré-agendamento na Mr. Jones.",
        "",
        `Unidade: ${unidadeLabel}`,
        `Nome: ${nome}`,
        `WhatsApp: ${telefone}`,
        `Serviço: ${servico}`,
        `Dia desejado: ${formattedDate}`,
        `Período preferencial: ${periodo}`
      ];

      if (observacoes) {
        messageLines.push(`Observações: ${observacoes}`);
      }

      messageLines.push("", "Pode me confirmar os horários disponíveis?");

      const message = encodeURIComponent(messageLines.join("\n"));
      const whatsappUrl = `https://wa.me/${phone}?text=${message}`;

      setFeedback("Abrindo WhatsApp para confirmar seu horário...", "success");
      window.open(whatsappUrl, "_blank", "noopener");
    });
  }

  const mapGates = document.querySelectorAll("[data-map-embed]");
  if (mapGates.length > 0) {
    mapGates.forEach((gate) => {
      const trigger = gate.querySelector(".map-load-btn");
      if (!trigger) return;

      trigger.addEventListener(
        "click",
        () => {
          const mapSrc = gate.getAttribute("data-map-src");
          if (!mapSrc) return;

          trigger.disabled = true;
          trigger.textContent = "Carregando...";

          const iframe = document.createElement("iframe");
          iframe.title = gate.getAttribute("data-map-title") || "Mapa da unidade";
          iframe.src = mapSrc;
          iframe.width = "600";
          iframe.height = "450";
          iframe.loading = "lazy";
          iframe.referrerPolicy = "no-referrer-when-downgrade";
          iframe.style.border = "0";
          iframe.allowFullscreen = true;

          gate.replaceWith(iframe);
        },
        { once: true }
      );
    });
  }

  const revealItems = document.querySelectorAll("[data-reveal]");
  if (revealItems.length > 0 && "IntersectionObserver" in window) {
    revealItems.forEach((item, index) => {
      const delay = Math.min(index * 45, 360);
      item.style.setProperty("--reveal-delay", `${delay}ms`);
    });

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: "0px 0px -40px 0px"
      }
    );

    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }

  function formatDateBR(value) {
    if (!value) return "";
    const [year, month, day] = value.split("-");
    if (!year || !month || !day) return value;
    return `${day}/${month}/${year}`;
  }

  function sanitizeLine(value) {
    return (value || "").toString().trim().replace(/\s+/g, " ");
  }

  function setFeedback(message, type) {
    if (!feedback) return;
    feedback.textContent = message;
    feedback.classList.remove("success", "error");
    if (type) {
      feedback.classList.add(type);
    }
  }

  function clearFeedback() {
    if (!feedback) return;
    feedback.textContent = "";
    feedback.classList.remove("success", "error");
  }
})();


