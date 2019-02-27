'use strict';

togglbutton.render(
  '#ticketDetailsContainer:not(.toggl)',
  { observe: true },
  function (elem) {
    const container = createTag('li', 'toggle-container');

    const descFunc = function () {
      return document
        .querySelector('#copyButton1')
        .getAttribute('data-clipboard-text');
    };

    const projectFunc = function () {
      return $('h1.header-w > span').textContent || '';
    };

    const link = togglbutton.createTimerLink({
      className: 'assembla',
      description: descFunc,
      projectName: projectFunc
    });

    container.appendChild(link);
    $('ul.menu-submenu').appendChild(container);
  }
);
