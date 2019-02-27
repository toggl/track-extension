'use strict';

// Listing view
togglbutton.render('.issues .issue:not(.toggl)', { observe: true }, function (
  elem
) {
  const description = $('.subject span.issue-status', elem).textContent.trim();
  const project = $('.switcher-project-name').textContent.trim();

  const link = togglbutton.createTimerLink({
    className: 'sifterapp',
    description: description,
    projectName: project
  });

  $('.subject a.issue-status', elem).appendChild(link);
});

// Detail view
togglbutton.render(
  '.issue-detail-subject:not(.toggl)',
  { observe: true },
  function (elem) {
    const description = $('h1', elem).childNodes[0].textContent.trim();
    const project = $('.switcher-project-name').textContent.trim();

    const link = togglbutton.createTimerLink({
      className: 'sifterapp',
      description: description,
      projectName: project
    });

    elem.appendChild(link);
  }
);
