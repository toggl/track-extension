'use strict';

togglbutton.render('.PageListItem:not(.toggl)', { observe: true }, function (
  elem
) {
  const description = $('.label_title', elem).textContent;

  const link = togglbutton.createTimerLink({
    className: 'processwire',
    description: description,
    buttonType: 'minimal'
  });

  elem.appendChild(link);
});

togglbutton.render(
  '.ProcessPageEdit h1:not(.toggl)',
  { observe: true },
  function (elem) {
    const description = elem.textContent;

    const link = togglbutton.createTimerLink({
      className: 'processwire',
      description: description,
      buttonType: 'minimal'
    });

    elem.appendChild(link);
  }
);
