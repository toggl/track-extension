'use strict';

togglbutton.render(
  '.page-content .widget-toolbox .pull-left:not(.toggl)',
  { observe: true },
  function (elem) {
    const description = document.querySelector('td.bug-summary').textContent;
    const project = document.querySelector('td.bug-project').textContent;

    const link = togglbutton.createTimerLink({
      className: 'mantishub',
      description: description,
      projectName: project
    });

    elem.appendChild(link);
  }
);

// Classic UI
togglbutton.render(
  '#view-issue-details:not(.toggl)',
  { observe: true },
  function (elem) {
    const description = $('td.bug-summary', elem).textContent;
    const project = $('td.bug-project', elem).textContent;

    const link = togglbutton.createTimerLink({
      className: 'mantishub',
      description: description,
      projectName: project
    });

    $('.form-title', elem).appendChild(link);
  }
);
