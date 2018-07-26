'use strict';

togglbutton.render(
  'div.importances:not(.toggl)',
  { observe: true },
  function() {
    var link,
      description = $('#story_name p').textContent,
      projectName = $('.project .name').textContent,
      div = document.createElement('div'),
      importanceDiv = $('div.importances'),
      collectorDiv = importanceDiv.parentNode;

    div.className = 'fl';

    link = togglbutton.createTimerLink({
      className: 'planbox',
      description: description,
      projectName: projectName
    });

    div.appendChild(link);
    collectorDiv.insertBefore(div, importanceDiv.nextSibling);
  }
);
