// ── UTILITIES ────────────────────────────────

function getAllTextNodes(element) {
    if(element) {
        return Array.from(element.childNodes).filter(node => node.nodeType === 3 && node.textContent.trim().length > 1);
    }
}
function inputWrap(el, next = null, type = 'checkbox') {
    if(next) {
        $(el).nextUntil(next).andSelf().wrapAll(`<label class="input-wrap ${type}"></label>`);
    } else {
        $(el).next().andSelf().wrapAll(`<label class="input-wrap ${type}"></label>`);
    }
}
function fancyBoxes() {
    document.querySelectorAll('.input-wrap.checkbox').forEach(label => {
        label.querySelector('input').insertAdjacentHTML('afterend', `<div class="fancy-input checkbox">x</div>`);
    });
    document.querySelectorAll('.input-wrap.radio').forEach(label => {
        label.querySelector('input').insertAdjacentHTML('afterend', `<div class="fancy-input radio">x</div>`);
    });
}

// ── THEME TOGGLE ─────────────────────────────

document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("theme-toggle");
  if (!toggle) return;

  // set tooltip text to match current theme on load
  updateThemeTooltip(document.documentElement.dataset.theme);

  toggle.addEventListener("click", () => {
    const current = document.documentElement.dataset.theme;
    const next = current === "light" ? "dark" : "light";
    setTheme(next, true);
    updateThemeTooltip(next);
  });

  function setTheme(theme, persist = false) {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    if (persist) {
      try { localStorage.setItem("theme", theme); } catch(e) {}
    }
  }

  function updateThemeTooltip(theme) {
    toggle.dataset.tooltip = theme === "dark"
      ? "Switch to light mode"
      : "Switch to dark mode";
  }
});