/* ============================================================
   Landing interactions — vanilla, no framework.
   - email validation + simulated submit + thank-you state
   - card CTAs scroll to the hero email and focus it (single goal)
   - footer year
   ============================================================ */
(function () {
  "use strict";

  var SHEETS_WEB_APP_URL = "https://script.google.com/macros/s/AKfycbwlmG1MKmYnCad6uHXhuVkW1I-ycOtrmTOCKZml6xAW-IoHC8JcbXqf885eiB9AbIwZOw/exec";
  var CONSENT_TEXT = "Acepto recibir emails de Diario de un exfumador y entiendo que mis datos se usarán para enviarme contenido relacionado con este proceso.";

  var capture = document.getElementById("capture");
  var form = document.getElementById("signup-form");
  var nameInput = document.getElementById("name");
  var input = document.getElementById("email");
  var phase = document.getElementById("phase");
  var consent = document.getElementById("consent");
  var consentWrap = document.querySelector(".consent-check");
  var nameErrEl = document.getElementById("name-error");
  var errEl = document.getElementById("email-error");
  var consentErrEl = document.getElementById("consent-error");
  var submitErrEl = document.getElementById("submit-error");
  var submitBtn = form ? form.querySelector(".btn-primary") : null;

  function isValidEmail(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v).trim());
  }

  function getSelectedPhaseText() {
    if (!phase || phase.selectedIndex < 0) return "";
    var option = phase.options[phase.selectedIndex];
    return option && option.value ? option.textContent.trim() : "";
  }

  /* ---- focus the hero email from anywhere ---- */
  function goToEmail() {
    if (!capture) return;
    capture.scrollIntoView ? null : null; // (avoid scrollIntoView per guidance)
    var top = capture.getBoundingClientRect().top + window.pageYOffset - 24;
    window.scrollTo({ top: top, behavior: "smooth" });

    capture.classList.add("is-pulsing");
    window.setTimeout(function () {
      if (input && !capture.classList.contains("is-done")) {
        try { input.focus({ preventScroll: true }); } catch (e) { input.focus(); }
      }
    }, 520);
    window.setTimeout(function () {
      capture.classList.remove("is-pulsing");
    }, 1600);
  }

  var triggers = document.querySelectorAll("[data-scroll-to-email]");
  for (var i = 0; i < triggers.length; i++) {
    triggers[i].addEventListener("click", function (e) {
      e.preventDefault();
      var ph = this.getAttribute("data-phase");
      if (ph && phase) {
        phase.value = ph;
        phase.classList.add("is-set");
      }
      goToEmail();
    });
  }

  /* keep the select's "set" styling in sync */
  if (phase) {
    phase.addEventListener("change", function () {
      if (phase.value) phase.classList.add("is-set");
      else phase.classList.remove("is-set");
    });
  }

  /* ---- live error clearing ---- */
  if (nameInput) {
    nameInput.addEventListener("input", function () {
      if (nameInput.classList.contains("has-error") && nameInput.value.trim().length > 1) {
        nameInput.classList.remove("has-error");
        if (nameErrEl) nameErrEl.classList.remove("show");
      }
    });
  }

  if (input) {
    input.addEventListener("input", function () {
      if (input.classList.contains("has-error") && isValidEmail(input.value)) {
        input.classList.remove("has-error");
        errEl.classList.remove("show");
      }
    });
  }

  if (consent) {
    consent.addEventListener("change", function () {
      if (consent.checked) {
        if (consentWrap) consentWrap.classList.remove("has-error");
        if (consentErrEl) consentErrEl.classList.remove("show");
      }
    });
  }

  /* ---- submit ---- */
  if (form) {
    form.addEventListener("submit", async function (e) {
      e.preventDefault();
      var nameVal = nameInput ? nameInput.value.trim() : "";
      var val = input.value;
      if (submitErrEl) submitErrEl.classList.remove("show");

      if (nameInput && nameVal.length < 2) {
        nameInput.classList.add("has-error");
        if (nameErrEl) nameErrEl.classList.add("show");
        try { nameInput.focus({ preventScroll: true }); } catch (err) { nameInput.focus(); }
        return;
      }
      if (nameInput) {
        nameInput.classList.remove("has-error");
        if (nameErrEl) nameErrEl.classList.remove("show");
      }

      if (!isValidEmail(val)) {
        input.classList.add("has-error");
        errEl.classList.add("show");
        try { input.focus({ preventScroll: true }); } catch (err) { input.focus(); }
        return;
      }
      input.classList.remove("has-error");
      errEl.classList.remove("show");

      if (!consent || !consent.checked) {
        if (consentWrap) consentWrap.classList.add("has-error");
        if (consentErrEl) consentErrEl.classList.add("show");
        try { consent.focus({ preventScroll: true }); } catch (err) { consent.focus(); }
        return;
      }

      var payload = {
        name: nameVal,
        email: val.trim(),
        phase: getSelectedPhaseText(),
        consent: true,
        consentText: CONSENT_TEXT,
        consentAt: new Date().toISOString(),
        pageUrl: window.location.href,
        userAgent: navigator.userAgent
      };

      if (!SHEETS_WEB_APP_URL) {
        try { localStorage.setItem("diario_signup_pending", JSON.stringify(payload)); } catch (err) {}
        if (submitErrEl) {
          submitErrEl.textContent = "El formulario está preparado, pero falta conectar la URL de Google Sheets.";
          submitErrEl.classList.add("show");
        }
        return;
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Guardando...";
      }

      try {
        await fetch(SHEETS_WEB_APP_URL, {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "text/plain;charset=utf-8" },
          body: JSON.stringify(payload)
        });
        try { localStorage.setItem("diario_signup", JSON.stringify(payload)); } catch (err) {}
      } catch (err) {
        if (submitErrEl) submitErrEl.classList.add("show");
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = "Quiero que me acompañes";
        }
        return;
      }

      capture.classList.add("is-done");
      var note = document.getElementById("capture-note");
      if (note) note.style.display = "none";
    });
  }

  /* ---- footer year ---- */
  var y = document.getElementById("year");
  if (y) y.textContent = String(new Date().getFullYear());
})();
