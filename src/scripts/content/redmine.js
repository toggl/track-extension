'use strict';

togglbutton.render(
  'body.controller-issues.action-show h2:not(.toggl)',
  {},
  function (elem) {
    const numElem = $('h2');
    const titleElem = $('.subject h3') || '';
    const projectElem = $('h1');
    let description;

    if ($('.toggl-button')) {
      return;
    }

    if (titleElem) {
      description = titleElem.textContent;
    }

    if (numElem !== null) {
      if (description) {
        description = ' ' + description;
      }
      description = numElem.textContent + description;
    }

    const link = togglbutton.createTimerLink({
      className: 'redmine',
      description: description,
      projectName: projectElem && projectElem.textContent
    });

    $('h2').appendChild(link);
  }
);
