'use strict';

// Tickets page
togglbutton.render('#content .right:not(.toggl)', { observe: true }, function(
  elem
) {
  var div,
    link,
    description = $('h2.Thread__subject').textContent.trim(),
    project = $('.site-header__title').textContent.trim(),
    existingTag = $('.sidebar__module.toggl');

  if (existingTag) {
    if (existingTag.parentNode.firstChild.classList.contains('toggl')) {
      return;
    }
    existingTag.parentNode.removeChild(existingTag);
  }

  div = document.createElement('div');
  div.classList.add('sidebar__module', 'toggl');

  link = togglbutton.createTimerLink({
    className: 'codebase',
    description: description,
    projectName: project
  });

  div.appendChild(link);
  elem.prepend(div);
});

// Merge Requests page
togglbutton.render(
  '.merge-request-summary:not(.toggl)',
  { observe: true },
  function() {
    var link,
      description = $('h2.u-ellipsis').textContent.trim(),
      project = $('.site-header__title').textContent.trim();

    link = togglbutton.createTimerLink({
      className: 'codebase',
      description: description,
      projectName: project
    });

    $('.merge-request-summary__title').appendChild(link);
  }
);
