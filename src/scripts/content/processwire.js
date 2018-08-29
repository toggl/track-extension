'use strict';

togglbutton.render('.PageListItem:not(.toggl)', { observe: true }, function(
  elem
) {
  var link,
    description = $('.label_title', elem).textContent;

  link = togglbutton.createTimerLink({
    className: 'processwire',
    description: description,
    buttonType: 'minimal'
  });

  elem.appendChild(link);
});

togglbutton.render(
  '.ProcessPageEdit h1:not(.toggl)',
  { observe: true },
  function(elem) {
    var link,
      description = elem.textContent;

    link = togglbutton.createTimerLink({
      className: 'processwire',
      description: description,
      buttonType: 'minimal'
    });

    elem.appendChild(link);
  }
);
