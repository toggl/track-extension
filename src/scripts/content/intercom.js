'use strict';

togglbutton.render('.conversation__card__content-expanded__controls .inbox__conversation-controls__pane-selector:not(.toggl)',
  { observe: true },
  function (elem) {
    if (elem.querySelector('.toggl-button')) {
      // With the way this UI renders, we must check for existence of the button.
      return;
    }

    const root = elem.closest('.card.conversation__card');
    const descriptionSelector = () => {
      const description = $('.inbox__card__header__title', root);
      return description ? description.textContent.trim().replace(/ +/g, ' ') : '';
    };

    const link = togglbutton.createTimerLink({
      className: 'intercom',
      description: descriptionSelector
    });

    // Stop button being re-rendered while trying to click. Intercom has some kind of handlers doing things.
    link.addEventListener('mousedown', (e) => {
      e.preventDefault();
      e.stopPropagation();
    });

    elem.appendChild(link);
  });
