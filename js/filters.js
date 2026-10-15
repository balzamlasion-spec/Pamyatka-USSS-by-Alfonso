/* ============================================
   MAJESTIC USSS ORLANDO — ФИЛЬТРЫ УК
   Фильтр статей по судимости и сроку
   ============================================ */

(function() {
  "use strict";

  var filterSudimost = "all"; // all | yes | no
  var filterSrok = "all";     // all | 2 | 3 | 4 | 5

  // ============================================
  // ПРИМЕНИТЬ ФИЛЬТРЫ
  // ============================================
  function applyFilters() {
    var container = document.getElementById("ukArticles");
    if (!container) return; // не на той странице

    var visible = 0;
    var hidden = 0;

    // Обходим все секции с таблицами
    container.querySelectorAll(".section").forEach(function(section) {
      var title = section.querySelector(".section-title");
      // Пропускаем секцию "Судимость — когда ставится"
      if (title && title.textContent.indexOf("СУДИМОСТЬ") !== -1) return;

      var visibleInSection = 0;

      // Обходим строки таблицы
      section.querySelectorAll("table tr").forEach(function(row) {
        // Пропускаем заголовки
        if (row.querySelector("th")) return;

        var badge = row.querySelector(".badge");
        var srokCell = row.querySelector("td.srok");
        var srokText = srokCell ? srokCell.textContent : "";

        // Проверка по судимости
        var matchSudimost =
          filterSudimost === "all" ||
          (filterSudimost === "yes" && badge && badge.classList.contains("red")) ||
          (filterSudimost === "no" && badge && badge.classList.contains("gray"));

        // Проверка по сроку
        var matchSrok =
          filterSrok === "all" ||
          srokText.indexOf(filterSrok) !== -1;

        if (matchSudimost && matchSrok) {
          row.style.display = "";
          visibleInSection++;
          visible++;
        } else {
          row.style.display = "none";
          hidden++;
        }
      });

      // Скрываем секцию, если в ней ничего не видно
      section.style.display = visibleInSection > 0 ? "" : "none";
    });

    // Обновляем статистику
    var stats = document.getElementById("filterStats");
    if (stats) {
      stats.innerHTML = "📊 Найдено: <strong>" + visible + "</strong> · Скрыто: " + hidden;
    }
  }

  // ============================================
  // ОБРАБОТКА КЛИКОВ ПО КНОПКАМ ФИЛЬТРА
  // ============================================
  var filterButtons = document.querySelectorAll(".filter-btn");

  if (filterButtons.length > 0) {
    filterButtons.forEach(function(btn) {
      btn.addEventListener("click", function() {
        var sudimost = btn.getAttribute("data-filter");
        var srok = btn.getAttribute("data-filter-srok");

        // Если это кнопка судимости
        if (sudimost) {
          document.querySelectorAll("[data-filter]").forEach(function(b) {
            b.classList.remove("active");
          });
          btn.classList.add("active");
          filterSudimost = sudimost;
        }

        // Если это кнопка срока
        if (srok) {
          document.querySelectorAll("[data-filter-srok]").forEach(function(b) {
            b.classList.remove("active");
          });
          btn.classList.add("active");
          filterSrok = srok;
        }

        applyFilters();
      });
    });

    // Применяем фильтры при загрузке
    setTimeout(applyFilters, 100);
  }

  // ============================================
  // ЭКСПОРТ (на всякий случай)
  // ============================================
  window.USSS_Filters = {
    apply: applyFilters,
    reset: function() {
      filterSudimost = "all";
      filterSrok = "all";
      document.querySelectorAll(".filter-btn").forEach(function(b) {
        if (b.getAttribute("data-filter") === "all" ||
            b.getAttribute("data-filter-srok") === "all") {
          b.classList.add("active");
        } else {
          b.classList.remove("active");
        }
      });
      applyFilters();
    }
  };

})();