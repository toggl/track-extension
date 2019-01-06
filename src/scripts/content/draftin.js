'use strict';

togglbutton.render('#edit_menu_group:not(.toggl)', { observe: true }, function(
  elem
) {
  var link,
    description = $('title').textContent.trim();

  link = togglbutton.createTimerLink({
    className: 'draftin',
    description: description
  });

  elem.parentNode.insertBefore(link, elem);
});
