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

// This enables support for popup gmail view used by dragapp.com extension
togglbutton.render('div.subject:not(.toggl)', { observe: true }, function (elem) {
  const description = $('span', elem);

  if (!description) {
    return;
  }

  const link = togglbutton.createTimerLink({
    className: 'google-mail',
    description: description.textContent
  });

  elem.children[0].insertBefore(link, elem.children[0].children[1]);
});
