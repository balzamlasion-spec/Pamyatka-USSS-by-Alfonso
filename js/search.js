/* ============================================
   MAJESTIC USSS ORLANDO — ПОИСК
   Умный поиск с синонимами, нормализацией и подсветкой
   ============================================ */

(function() {
  "use strict";

  // ============================================
  // СЛОВАРЬ СИНОНИМОВ
  // Если пользователь ищет "наручники" — найдёт и "cuff"
  // ============================================
  var SYNONYMS = {
    "наручники": ["cuff", "наручник", "наручниками"],
    "cuff": ["наручники"],
    "задержание": ["арест", "задержать", "задержан"],
    "арест": ["задержание", "посадить"],
    "документы": ["доки", "паспорт", "удостоверение"],
    "доки": ["документы", "паспорт"],
    "удостоверение": ["удо", "жетон", "бейджик", "нашивка"],
    "удо": ["удостоверение"],
    "миранда": ["права", "зачитать", "огласить"],
    "маска": ["снять маску", "балаклава", "капюшон"],
    "оружие": ["ствол", "пистолет", "пушка", "дробовик"],
    "штраф": ["наказание", "пеня"],
    "залог": ["выкуп", "освобождение под залог"],
    "прокурор": ["огп", "гп", "прокуратура", "прокуроры"],
    "адвокат": ["защитник", "юрист", "адвокаты"],
    "судья": ["суд", "судьи"],
    "губернатор": ["губер", "губ", "губернаторы"],
    "кортеж": ["конвой", "колонна", "сопровождение"],
    "поставка": ["груз", "феррари", "матовозка"],
    "обыск": ["досмотр", "шмон", "личный обыск"],
    "выговор": ["взыскание", "warn", "выговоры"],
    "баллы": ["очки", "балл"],
    "ранг": ["звание", "повышение", "ранги"],
    "судимость": ["судимый", "судимости"],
    "ордер": ["ордера", "ордеров", "ордерах"],
    "неприкосновенность": ["неприкос", "неприкосновенные"],
    "неприкос": ["неприкосновенность"],
    "уровень": ["уровни", "зелёный", "жёлтый", "красный"],
    "сопровождение": ["сопровождении", "сопровождать"],
    "форма": ["дресс-код", "форма одежды"],
    "строя": ["строй", "построение"],
    "колонна": ["колонны", "колонне"],
    "зот": ["зоны", "территории", "территориях"],
    "пк": ["процессуальный", "процессуального"],
    "ук": ["уголовный", "уголовного"],
    "ак": ["административный", "административного"],
    "дк": ["дорожный", "дорожного"],
    "тк": ["трудовой", "трудового"],
    "эк": ["этический", "этического"]
  };

  // ============================================
  // НОРМАЛИЗАЦИЯ ТЕКСТА
  // Приводим всё к нижнему регистру, убираем лишние символы, ё → е
  // ============================================
  function normalize(text) {
    if (!text) return "";
    text = String(text).toLowerCase();
    text = text.replace(/ё/g, "е");
    text = text.replace(/[^\wа-я0-9\s\.\-]/gi, " ");
    text = text.replace(/\s+/g, " ").trim();
    return text;
  }

  // ============================================
  // СРЕЗАНИЕ ОКОНЧАНИЙ (для лучшего поиска)
  // "наручниками" → "наручник"
  // ============================================
  function getRoot(word) {
    word = normalize(word);
    if (word.length < 4) return word;
    var endings = [
      "иями", "ями", "ами", "ией", "ях", "ам", "ой", "ей", "ый", "ий",
      "ые", "ая", "ое", "их", "ых", "ого", "его", "ому", "ему",
      "ыми", "ими", "ть", "ся", "ться", "ешь", "ет", "ем", "ут", "ют",
      "ит", "ат", "ят", "ал", "ла", "ло", "ли", "ение", "ание",
      "ости", "ность", "ов", "ев", "ах", "ям"
    ];
    for (var i = 0; i < endings.length; i++) {
      var end = endings[i];
      if (word.length > end.length + 2 && word.slice(-end.length) === end) {
        return word.slice(0, word.length - end.length);
      }
    }
    return word;
  }

  // ============================================
  // ПОЛУЧИТЬ ВСЕ ФОРМЫ СЛОВА (слово + синонимы)
  // ============================================
  function getWordVariants(word) {
    var variants = [word];
    var norm = normalize(word);

    if (SYNONYMS[norm]) {
      SYNONYMS[norm].forEach(function(syn) {
        variants.push(normalize(syn));
      });
    }

    // Добавляем корень слова
    var root = getRoot(norm);
    if (root !== norm) variants.push(root);

    return variants;
  }

  // ============================================
  // ПОДСВЕТКА НАЙДЕННОГО ТЕКСТА
  // ============================================
  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function highlightText(node, query) {
    if (!query || !node) return;

    // Если текстовый узел
    if (node.nodeType === 3) {
      var text = node.nodeValue;
      var normalizedText = normalize(text);
      var idx = normalizedText.indexOf(query);
      if (idx === -1) return;

      var before = text.slice(0, idx);
      var match = text.slice(idx, idx + query.length);
      var after = text.slice(idx + query.length);

      var span = document.createElement("span");
      span.innerHTML = escapeHtml(before) +
                       '<mark class="hl">' + escapeHtml(match) + "</mark>" +
                       escapeHtml(after);
      node.parentNode.replaceChild(span, node);
    }
    // Если элемент — обходим дочерние узлы
    else if (node.nodeType === 1 &&
             node.tagName !== "SCRIPT" &&
             node.tagName !== "STYLE" &&
             !node.classList.contains("hl")) {
      var children = Array.prototype.slice.call(node.childNodes);
      children.forEach(function(child) {
        highlightText(child, query);
      });
    }
  }

  function clearHighlights() {
    document.querySelectorAll("mark.hl").forEach(function(mark) {
      var parent = mark.parentNode;
      parent.replaceChild(document.createTextNode(mark.textContent), mark);
      parent.normalize();
    });
  }

  // ============================================
  // ОСНОВНАЯ ФУНКЦИЯ ПОИСКА
  // ============================================
  var searchInput = document.getElementById("search");
  var searchCount = document.getElementById("searchCount");

  if (!searchInput) return;

  searchInput.addEventListener("input", function() {
    var query = normalize(searchInput.value);
    var count = 0;

    // Очищаем старую подсветку
    clearHighlights();

    // Показываем всё обратно
    document.querySelectorAll(".card, .qa, .situation, .section, .quick-card, table tr").forEach(function(el) {
      el.style.display = "";
    });

    // Если запрос пустой — просто скрываем счётчик
    if (!query) {
      if (searchCount) {
        searchCount.classList.remove("show");
        searchCount.textContent = "0";
      }
      return;
    }

    // Разбиваем запрос на слова
    var words = query.split(" ").filter(function(w) { return w.length > 1; });
    if (words.length === 0) return;

    // Получаем варианты для каждого слова
    var wordVariants = words.map(function(w) {
      return getWordVariants(w);
    });

    // ============================================
    // ИЩЕМ ПО КАРТОЧКАМ
    // ============================================
    document.querySelectorAll(".card, .qa, .situation, .quick-card").forEach(function(item) {
      var text = normalize(item.textContent);
      var matches = wordVariants.every(function(variants) {
        return variants.some(function(v) {
          return text.indexOf(v) !== -1;
        });
      });

      if (matches) {
        item.style.display = "";
        count++;
        // Подсвечиваем первое слово
        highlightText(item, words[0]);
      } else {
        item.style.display = "none";
      }
    });

    // ============================================
    // ИЩЕМ ПО СТРОКАМ ТАБЛИЦ
    // ============================================
    document.querySelectorAll("table tr").forEach(function(row) {
      // Пропускаем заголовки
      if (row.querySelector("th")) return;

      var text = normalize(row.textContent);
      var matches = wordVariants.every(function(variants) {
        return variants.some(function(v) {
          return text.indexOf(v) !== -1;
        });
      });

      row.style.display = matches ? "" : "none";
    });

    // ============================================
    // СКРЫВАЕМ ПУСТЫЕ СЕКЦИИ
    // ============================================
    document.querySelectorAll(".section").forEach(function(section) {
      var visibleCards = 0;
      section.querySelectorAll(".card, .qa, .situation").forEach(function(c) {
        if (c.style.display !== "none") visibleCards++;
      });
      var visibleRows = 0;
      section.querySelectorAll("table tr").forEach(function(r) {
        if (r.style.display !== "none" && !r.querySelector("th")) visibleRows++;
      });

      section.style.display = (visibleCards > 0 || visibleRows > 0) ? "" : "none";
    });

    // ============================================
    // ОБНОВЛЯЕМ СЧЁТЧИК
    // ============================================
    if (searchCount) {
      searchCount.textContent = count;
      searchCount.classList.toggle("show", count > 0);
    }
  });

  // ============================================
  // ОЧИСТКА ПОИСКА ПО ESC
  // ============================================
  searchInput.addEventListener("keydown", function(e) {
    if (e.key === "Escape") {
      searchInput.value = "";
      searchInput.dispatchEvent(new Event("input"));
      searchInput.blur();
    }
  });

})();