// Applies the saved theme (or the system one) before the first paint, avoiding a flash.
try {
  var saved = localStorage.getItem("livechurch-landing-theme");
  var prefersLight = matchMedia("(prefers-color-scheme: light)").matches;
  document.documentElement.dataset.theme = saved || (prefersLight ? "light" : "dark");
} catch (error) {
  console.warn("Não foi possível definir o tema inicial", error);
}
