/* ============================================================
   Landing interactions — vanilla, no framework.
   - email validation + simulated submit + thank-you state
   - card CTAs scroll to the hero email and focus it (single goal)
   - footer year
   ============================================================ */
(function () {
  "use strict";

  var capture = document.getElementById("capture");
  var form = document.getElementById("signup-form");
  var input = document.getElementById("email");
  var phase = document.getElementById("phase");
  var errEl = document.getElementById("email-error");

  function isValidEmail(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v).trim());
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
  if (input) {
    input.addEventListener("input", function () {
      if (input.classList.contains("has-error") && isValidEmail(input.value)) {
        input.classList.remove("has-error");
        errEl.classList.remove("show");
      }
    });
  }

  /* ---- submit ---- */
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var val = input.value;
      if (!isValidEmail(val)) {
        input.classList.add("has-error");
        errEl.classList.add("show");
        try { input.focus({ preventScroll: true }); } catch (err) { input.focus(); }
        return;
      }
      input.classList.remove("has-error");
      errEl.classList.remove("show");

      // Simulated submit. Replace with your provider (Mailchimp/Substack/etc.)
      // by POSTing `val` + `phase.value` to your endpoint here.
      var payload = { email: val.trim(), phase: phase ? phase.value : "" };
      try { localStorage.setItem("diario_signup", JSON.stringify(payload)); } catch (err) {}

      capture.classList.add("is-done");
      var note = document.getElementById("capture-note");
      if (note) note.style.display = "none";
    });
  }

  /* ---- footer year ---- */
  var y = document.getElementById("year");
  if (y) y.textContent = String(new Date().getFullYear());
})();
