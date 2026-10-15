/* ============================================
   MAJESTIC USSS ORLANDO — ОСНОВНОЙ СКРИПТ
   Часы, меню, кнопка наверх, тема, печать
   ============================================ */

(function() {
  "use strict";

  // ============================================
  // ЧАСЫ
  // ============================================
  var clockEl = document.getElementById("clock");
  if (clockEl) {
    function updateClock() {
      var n = new Date();
      var pad = function(x) { return String(x).padStart(2, "0"); };
      clockEl.textContent =
        pad(n.getDate()) + "." + pad(n.getMonth() + 1) + "." + n.getFullYear() +
        " " + pad(n.getHours()) + ":" + pad(n.getMinutes()) + ":" + pad(n.getSeconds());
    }
    updateClock();
    setInterval(updateClock, 1000);
  }

  // ============================================
  // МОБИЛЬНОЕ МЕНЮ (гамбургер)
  // ============================================
  var menuToggle = document.getElementById("menuToggle");
  var sidebar = document.querySelector(".sidebar");

  if (menuToggle && sidebar) {
    menuToggle.addEventListener("click", function(e) {
      e.stopPropagation();
      sidebar.classList.toggle("open");
    });

    // Закрытие меню при клике вне его
    document.addEventListener("click", function(e) {
      if (sidebar.classList.contains("open") &&
          !sidebar.contains(e.target) &&
          e.target !== menuToggle) {
        sidebar.classList.remove("open");
      }
    });

    // Закрытие при клике на ссылку
    sidebar.querySelectorAll(".sidebar-link").forEach(function(link) {
      link.addEventListener("click", function() {
        if (window.innerWidth <= 768) {
          sidebar.classList.remove("open");
        }
      });
    });
  }

  // ============================================
  // КНОПКА НАВЕРХ
  // ============================================
  var topBtn = document.getElementById("topBtn");
  if (topBtn) {
    window.addEventListener("scroll", function() {
      if (window.pageYOffset > 400) {
        topBtn.classList.add("show");
      } else {
        topBtn.classList.remove("show");
      }
    });

    topBtn.addEventListener("click", function() {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // ============================================
  // АКТИВНАЯ ССЫЛКА В МЕНЮ
  // ============================================
  // Определяем текущую страницу и подсвечиваем нужную ссылку
  var currentPage = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".sidebar-link").forEach(function(link) {
    var href = link.getAttribute("href");
    if (href === currentPage) {
      link.classList.add("active");
    }
  });

  // ============================================
  // КНОПКА ПЕЧАТИ
  // ============================================
  var printBtn = document.getElementById("printBtn");
  if (printBtn) {
    printBtn.addEventListener("click", function() {
      window.print();
    });
  }

  // ============================================
  // ПЛАВНАЯ ПРОКРУТКА ПО ЯКОРЯМ
  // ============================================
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener("click", function(e) {
      var targetId = this.getAttribute("href");
      if (targetId === "#") return;
      var target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        var headerOffset = 90;
        var elementPosition = target.getBoundingClientRect().top;
        var offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({ top: offsetPosition, behavior: "smooth" });
      }
    });
  });

  // ============================================
  // СОХРАНЕНИЕ ПОСЛЕДНЕЙ СТРАНИЦЫ В LOCALSTORAGE
  // (для удобства — чтобы знать, где были)
  // ============================================
  try {
    localStorage.setItem("usss_last_page", currentPage);
  } catch (e) {
    // игнорируем ошибки localStorage
  }

})();