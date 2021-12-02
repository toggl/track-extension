'use strict';

togglbutton.render('input[name=id]', {}, function (elem) {
  const description = elem.value;

  const link = togglbutton.createTimerLink({
    className: 'bugzilla',
    description: description,
    projectName: 'Bugs'
  });

  const targetElement = $('#summary_alias_container') || $('#summary_container');

  if (targetElement !== null) {
    targetElement.appendChild(link);
  }
});
