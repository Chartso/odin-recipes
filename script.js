document.addEventListener('DOMContentLoaded', function () {
  initDarkMode();
  initSearch();
  initPrint();
  initServings();
});

/* ---------- Dark mode toggle ---------- */

function initDarkMode() {
  var toggle = document.getElementById('theme-toggle');
  if (!toggle) return;

  var saved = localStorage.getItem('recipeBoxTheme');
  if (saved === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    toggle.textContent = 'Light Mode';
  }

  toggle.addEventListener('click', function () {
    var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    if (isDark) {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('recipeBoxTheme', 'light');
      toggle.textContent = 'Dark Mode';
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('recipeBoxTheme', 'dark');
      toggle.textContent = 'Light Mode';
    }
  });
}

/* ---------- Search / filter recipes (home page) ---------- */

function initSearch() {
  var input = document.getElementById('recipe-search');
  if (!input) return;

  var cards = document.querySelectorAll('.recipe-card');
  var noResults = document.getElementById('no-results');

  input.addEventListener('input', function () {
    var term = input.value.trim().toLowerCase();
    var visibleCount = 0;

    cards.forEach(function (card) {
      var name = card.querySelector('h2').textContent.toLowerCase();
      var match = name.indexOf(term) !== -1;
      card.style.display = match ? '' : 'none';
      if (match) visibleCount++;
    });

    if (noResults) {
      noResults.style.display = visibleCount === 0 ? 'block' : 'none';
    }
  });
}

/* ---------- Print recipe button ---------- */

function initPrint() {
  var btn = document.getElementById('print-btn');
  if (!btn) return;

  btn.addEventListener('click', function () {
    window.print();
  });
}

/* ---------- Servings adjuster ---------- */

function initServings() {
  var input = document.getElementById('servings-input');
  if (!input) return;

  var baseServings = parseFloat(input.value);
  var amounts = document.querySelectorAll('.amt');

  amounts.forEach(function (el) {
    el.dataset.baseAmt = el.dataset.amt;
  });

  function updateAmounts() {
    var current = parseFloat(input.value);
    if (!current || current < 1) return;

    var ratio = current / baseServings;

    amounts.forEach(function (el) {
      var baseAmt = parseFloat(el.dataset.baseAmt);
      var unit = el.dataset.unit || '';
      var scaled = baseAmt * ratio;
      el.textContent = formatAmount(scaled) + (unit ? ' ' + unit : '');
    });
  }

  input.addEventListener('input', updateAmounts);

  var minusBtn = document.getElementById('servings-minus');
  var plusBtn = document.getElementById('servings-plus');

  if (minusBtn) {
    minusBtn.addEventListener('click', function () {
      var val = parseFloat(input.value);
      if (val > 1) {
        input.value = val - 1;
        updateAmounts();
      }
    });
  }

  if (plusBtn) {
    plusBtn.addEventListener('click', function () {
      var val = parseFloat(input.value);
      input.value = val + 1;
      updateAmounts();
    });
  }
}


function formatAmount(value) {
  var whole = Math.floor(value);
  var fraction = value - whole;

  var fractionMap = [
    { decimal: 0.25, label: '1/4' },
    { decimal: 0.33, label: '1/3' },
    { decimal: 0.5, label: '1/2' },
    { decimal: 0.67, label: '2/3' },
    { decimal: 0.75, label: '3/4' }
  ];

  var closest = null;
  fractionMap.forEach(function (f) {
    if (Math.abs(fraction - f.decimal) < 0.04) {
      closest = f.label;
    }
  });

  if (closest) {
    return whole > 0 ? whole + ' ' + closest : closest;
  }

  if (fraction < 0.04) {
    return String(whole);
  }

  return value.toFixed(1);
}