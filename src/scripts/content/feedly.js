'use strict';

togglbutton.render('.entryHeader:not(.toggl)', { observe: true }, function (
  elem
) {
  const textnode = document.createTextNode('\u00A0//\u00A0 ');
  const description = $('.entryTitle', elem).textContent;

  const link = togglbutton.createTimerLink({
    className: 'feedly',
    description: description
  });

  $('.entryHeader > .metadata', elem).appendChild(textnode);
  $('.entryHeader > .metadata', elem).appendChild(link);
});
