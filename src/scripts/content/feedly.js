'use strict';

togglbutton.render('.entryHeader:not(.toggl)', { observe: true }, function(
  elem
) {
  var link,
    textnode = document.createTextNode('\u00A0//\u00A0 '),
    description = $('.entryTitle', elem).textContent;

  link = togglbutton.createTimerLink({
    className: 'feedly',
    description: description
  });

  elem.querySelector('.entryHeader > .metadata').appendChild(textnode);
  elem.querySelector('.entryHeader > .metadata').appendChild(link);
});
