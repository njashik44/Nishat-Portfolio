/* ============================================================
   script.js — shared JavaScript for all pages of the portfolio
   1. Highlights the navigation link of the current page
   2. Opens/closes the mobile menu
   3. Validates the contact form and submits it with Ajax
   4. Filters the project cards with jQuery (Projects page)
   ============================================================ */

/* --- 1 + 2: navigation (plain JavaScript, runs on every page) --- */
document.addEventListener("DOMContentLoaded", function () {

  // Highlight the current page in the menu: compare the file name
  // in the address bar with each link's href and mark the match.
  var page = window.location.pathname.split("/").pop();
  if (page === "") { page = "index.html"; }
  var links = document.querySelectorAll("nav a");
  links.forEach(function (link) {
    if (link.getAttribute("href") === page) {
      link.classList.add("active");
      link.setAttribute("aria-current", "page");
    }
  });

  // Mobile menu: the hamburger button toggles class "open" on <nav>,
  // and the CSS in the media query shows or hides it.
  var menuBtn = document.getElementById("menuBtn");
  var nav = document.getElementById("mainNav");
  if (menuBtn && nav) {
    menuBtn.addEventListener("click", function () {
      nav.classList.toggle("open");
    });
  }

  // Footer year is written by JavaScript so it is always current.
  var yearEl = document.getElementById("year");
  if (yearEl) { yearEl.textContent = new Date().getFullYear(); }
});

/* --- 3: contact form validation + Ajax submit (Contact page) --- */
var form = document.getElementById("contactForm");
if (form) {
  form.addEventListener("submit", function (event) {
    event.preventDefault();              // stop the normal page reload

    var name    = document.getElementById("fullName").value.trim();
    var email   = document.getElementById("email").value.trim();
    var subject = document.getElementById("subject").value;
    var message = document.getElementById("message").value.trim();
    var ok = true;

    // Helper: write an error message under a field (or clear it)
    function setError(id, text) {
      document.getElementById(id).textContent = text;
      if (text !== "") { ok = false; }
    }
    setError("errName",    name === "" ? "Please write your name." : "");
    // A simple email pattern: text @ text . text
    setError("errEmail",   /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? "" : "Please write a valid email address.");
    setError("errSubject", subject === "" ? "Please choose a subject." : "");
    setError("errMessage", message.length < 10 ? "Please write a message of at least 10 characters." : "");
    if (!ok) { return; }                 // errors found: do not send

    // Ajax: send the form data in the background with fetch().
    // There is no server in this class project, so the request is
    // sent to a test endpoint; the success box is shown either way
    // so the full Ajax flow can be demonstrated.
    var data = new FormData(form);
    fetch("https://httpbin.org/post", { method: "POST", body: data })
      .catch(function () { /* offline: still show the demo result */ })
      .finally(function () {
        document.getElementById("formSuccess").style.display = "block";
        document.getElementById("successText").textContent =
          "Thank you, " + name + ". Your message has been sent. I will reply to " + email + " soon.";
        form.reset();
      });
  });
}

/* --- 4: project filter with jQuery (Projects page only) --- */
if (window.jQuery) {
  jQuery(document).ready(function ($) {
    $(".filters button").on("click", function () {
      $(".filters button").removeClass("active");
      $(this).addClass("active");
      var wanted = $(this).data("filter");       // all / web / systems / hardware
      $(".card[data-cat]").each(function () {
        var show = (wanted === "all" || $(this).data("cat") === wanted);
        $(this).toggle(show);                    // hide or show the card
      });
    });
  });
}
