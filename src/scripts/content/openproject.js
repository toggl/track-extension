'use strict';

// Work packages list items
togglbutton.render(
  'table.work-package-table tbody tr td.id:not(.toggl)',
  { observe: true },
  function(elem) {
    var link,
      container = elem,
      description = $(
        'span[data-field-name="subject"]',
        elem.parentNode
      ).textContent.trim(),
      projectName = $('#projects-menu').title.trim();

    link = togglbutton.createTimerLink({
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
  function(elem) {
    var link,
      container = $('.attributes-group--header', elem),
      description = $('.subject').textContent.trim(),
      projectName = $('#projects-menu').title.trim();

    link = togglbutton.createTimerLink({
      className: 'openproject',
      description: description,
      projectName: projectName
    });

    container.appendChild(link);
  }
);
