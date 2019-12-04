'use strict';

// Selectors here are madness, it works for as of Dec 4th 2019
// Button renders in popup/dialog view
togglbutton.render(
  '.notion-peek-renderer:not(.toggl)',
  { observe: true },
  function (elem) {
    function getDescription () {
      const descriptionElem = elem.querySelector('.notion-scroller .notion-selectable div[contenteditable="true"]');
      return descriptionElem ? descriptionElem.textContent.trim() : '';
    }

    const link = togglbutton.createTimerLink({
      className: 'notion',
      description: getDescription
    });

    const root = elem.querySelector('div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(3)');
    if (root) {
      root.prepend(link);
    }
  }
);
