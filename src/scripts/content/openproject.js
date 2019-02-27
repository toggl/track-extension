'use strict';

// Work packages list items
togglbutton.render(
  'table.work-package-table tbody tr td.id:not(.toggl)',
  { observe: true },
  function (elem) {
    const container = elem;
    const description = $(
      'span[data-field-name="subject"]',
      elem.parentNode
    ).textContent.trim();
    const projectName = $('#projects-menu').title.trim();

    const link = togglbutton.createTimerLink({
      className: 'openproject',
      description: description,
      projectName: projectName,
      buttonType: 'minimal'
    });

    container.appendChild(link);
  }
);

// Work packages details view
togglbutton.render(
  '.work-packages--show-view:not(.toggl)',
  { observe: true },
  function (elem) {
    const container = $('.attributes-group--header', elem);
    const description = $('.subject').textContent.trim();
    const projectName = $('#projects-menu').title.trim();

    const link = togglbutton.createTimerLink({
      className: 'openproject',
      description: description,
      projectName: projectName
    });

    container.appendChild(link);
  }
);
