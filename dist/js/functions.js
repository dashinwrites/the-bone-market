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
function fancyBoxes(type = 'checkbox') {
    document.querySelectorAll('.input-wrap.checkbox').forEach(label => {
        label.querySelector('input').insertAdjacentHTML('afterend', `<div class="fancy-input checkbox">x</div>`);
    });
    document.querySelectorAll('.input-wrap.radio').forEach(label => {
        label.querySelector('input').insertAdjacentHTML('afterend', `<div class="fancy-input radio">x</div>`);
    });
}

document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const toggle = document.getElementById("theme-toggle");

  const saved = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const startTheme = saved || (prefersDark ? "dark" : "light");
  setTheme(startTheme);

  toggle.addEventListener("click", () => {
    const next = body.dataset.theme === "light" ? "dark" : "light";
    setTheme(next, true);
  });

  function setTheme(theme, persist = false) {
    body.dataset.theme = theme;
    body.setAttribute("data-theme", theme);
    document.documentElement.style.colorScheme = theme;
    if (persist) localStorage.setItem("theme", theme);
  }
});

