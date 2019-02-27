'use strict';

togglbutton.render('.bJ:not(.toggl)', { observe: true }, function (elem) {
  const description = $('.eo > span', elem).textContent;
  const toolbar = $('.iK', elem);

  const link = togglbutton.createTimerLink({
    className: 'google-inbox',
    description: description,
    buttonType: 'minimal'
  });

  toolbar.parentElement.insertBefore(link, toolbar);
});
