'use strict';

function createWrapper (link) {
  const wrapper = document.createElement('div');
  wrapper.classList.add('toggl-button-notion-wrapper');
  wrapper.appendChild(link);

  return wrapper;
}

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

    const wrapper = createWrapper(link);

    const root = elem.querySelector('div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(3)');
    if (root) {
      root.prepend(wrapper);
    }
  }
);

togglbutton.render(
  '.notion-topbar-action-buttons:not(.toggl)',
  { observe: true },
  function (elem) {
    if (!elem) return;

    elem.style.position = 'relative';

    function getDescription () {
      const controls = document.querySelector('.notion-page-controls');
      if (!controls) return '';

      let title = '';

      if (controls.nextElementSibling) {
        title = controls.nextElementSibling;
      } else {
        const parent = controls.parentElement;

        if (!parent) return '';

        title = parent ? parent.nextElementSibling : '';
      }

      return title ? title.textContent.trim() : '';
    }

    const link = togglbutton.createTimerLink({
      className: 'notion',
      description: getDescription
    });

    const wrapper = createWrapper(link);

    elem.prepend(wrapper);
  }
);
