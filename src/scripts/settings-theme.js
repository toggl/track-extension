let darkMode = JSON.parse(localStorage.getItem('darkMode'));
if (darkMode === null) darkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
darkMode && document.documentElement.classList.add('dark');
