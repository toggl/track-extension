'use strict';

togglbutton.render('#submenu:not(.toggl)', { observe: true }, function () {
  const titleElem = $('#mailing-name');
  const li = document.createElement('li');
  const description = titleElem.value;

  const link = togglbutton.createTimerLink({
    className: 'newsletter2go',
    description: description
  });

  li.className = 'sm submenu center';
  li.appendChild(link);
  $('#submenu').appendChild(li);
});
