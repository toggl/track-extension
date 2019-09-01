'use strict';

togglbutton.render(
  '.notion-page-controls:not(.toggl)',
  { observe: true },
  function (elem) {
    const container = createTag('div', 'button-link notion-tb-wrapper');

    const descriptionElem = () => {
      return document.title;
    };

    const togglButtonLoc = $(
      '.notion-page-controls > div'
    );

    const link = togglbutton.createTimerLink({
      className: 'notion',
      description: descriptionElem
    });

    container.appendChild(link);
    console.log(togglButtonLoc.parentNode);
    togglButtonLoc.parentNode.insertBefore(container, togglButtonLoc);
  }
);
