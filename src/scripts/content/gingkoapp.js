'use strict';

togglbutton.render('#navbar:not(.toggl)', { observe: true }, function (elem) {
  const description = $('.navbar-tree-name', elem);
  const project = '';

  const descFunc = function () {
    return description.textContent.trim();
  };

  const link = togglbutton.createTimerLink({
    className: 'gingko-toggl-btn',
    description: descFunc,
    projectName: project,
    buttonType: 'minimal'
  });

  link.style.margin = '9px';

  $('.right-block').appendChild(link);
});
