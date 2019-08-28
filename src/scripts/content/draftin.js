'use strict';

togglbutton.render('#edit_menu_group:not(.toggl)', { observe: true }, function (
  elem
) {
  const description = $('title').textContent.trim();
  const link = togglbutton.createTimerLink({
    className: 'draftin',
    description: description
  });

  elem.parentNode.insertBefore(link, elem);
});
