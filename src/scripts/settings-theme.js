let darkMode = JSON.parse(localStorage.getItem('darkMode'));
if (darkMode === null) darkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
if (darkMode) {
  document.documentElement.classList.add('dark');
  document.body.classList.add('dark');
}
