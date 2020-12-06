'use strict';

togglbutton.render('.conversation__card__content-expanded__controls .inbox__conversation-controls__pane-selector:not(.toggl)',
  { observe: true },
  function (elem) {
    if ($('.toggl-button', elem)) {
      // With the way this UI renders, we must check for existence of the button.
      return;
    }

    const root = elem.closest('.card.conversation__card');
    const descriptionSelector = () => {
      const description = $('.inbox__card__header__title', root);
      return description ? description.textContent.trim().replace(/ +/g, ' ') : '';
    };

    /**
     * @type {HTMLElement}
     */
    const link = togglbutton.createTimerLink({
      className: 'intercom',
      description: descriptionSelector
    });
    link.style.paddingRight = '15px';

    // Stop button being re-rendered while trying to click. Intercom has some kind of handlers doing things.
    link.addEventListener('mousedown', (e) => {
      e.preventDefault();
      e.stopPropagation();
    });

    elem.appendChild(link);
  });

togglbutton.render('.articles__editor__header-text:not(.toggl)',
  { observe: true },
  function (elem) {
    const descriptionSelector = () => {
      const description = elem.textContent;
      return description ? description.trim() : '';
    };

    const link = togglbutton.createTimerLink({
      className: 'intercom',
      description: descriptionSelector,
      buttonType: 'minimal'
    });
    link.style.margin = '3px 15px';

    elem.appendChild(link);
  });
