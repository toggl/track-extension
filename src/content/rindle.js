'use strict';

togglbutton.render(
  '.time__tracker .toggl__container:not(.toggl)',
  { observe: true },
  function (elem) {
    const projectName = $('.navbar-default .dropdown .navbar-brand .ng-scope')
      .textContent;

    const descFunc = function () {
      const card = $('.toggl__card-title', elem);
      if (card) {
        return card.textContent;
      }
      return null;
    };

    const link = togglbutton.createTimerLink({
      className: 'rindle',
      description: descFunc,
      projectName: projectName
    });

    elem.appendChild(link);
  }
);
