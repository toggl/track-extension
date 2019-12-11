'use strict';

// Button renders left of page title
togglbutton.render(
  '.notion-page-controls + div:not(.toggl)',
  { observe: true },
  function (elem) {
    elem.style.position = 'relative';

    function getDescription () {
      const descriptionElem = elem;
      return descriptionElem ? descriptionElem.textContent.trim() : '';
    }

    const link = togglbutton.createTimerLink({
      className: 'notion',
      buttonType: 'minimal',
      description: getDescription
    });

    elem.prepend(link);
  }
);
