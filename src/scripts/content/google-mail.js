'use strict';

togglbutton.render('.ha:not(.toggl)', { observe: true }, function (elem) {
  const description = $('h2', elem);
  const project = $('.hX:last-of-type .hN', elem);

  if (!description) {
    return;
  }

  const link = togglbutton.createTimerLink({
    className: 'google-mail',
    description: description.textContent,
    projectName: !!project && project.textContent.split('/').pop()
  });

  elem.appendChild(link);
});
