'use strict';

// Work packages details view
togglbutton.render(
  '.work-packages--show-view:not(.toggl)',
  { observe: true },
  function (elem) {
    const workPackageId = $('.work-packages--info-row > span:first-of-type').textContent.trim();
    const container = $('.toolbar-items', elem);
    const description = '[OP' + workPackageId + '] ' + $('.subject').textContent.trim();
    const projectName = $('#projects-menu').title.trim();

    const link = togglbutton.createTimerLink({
      className: 'openproject',
      description: description,
      projectName: projectName
    });

    container.prepend(link);
  }
);
