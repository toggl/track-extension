'use strict';

/* Epic/User story/Task/Issue details button */
togglbutton.render(
  '.detail-title-wrapper:not(.toggl)',
  { observe: true },
  function(elem) {
    var link,
      projectElem = $('.us-detail .project-name'),
      refElem = $('.detail-number', elem),
      titleElem = $('.detail-subject', elem);

    link = togglbutton.createTimerLink({
      className: 'taiga',
      buttonType: 'minimal',
      projectName: projectElem.textContent,
      description: refElem.textContent.trim() + ' ' + titleElem.textContent
    });

    elem.insertBefore(link, $('.detail-title-text', elem));
  }
);

/* Epics Dashboard */
togglbutton.render('.epic-row .name:not(.toggl)', { observe: true }, function(
  elem
) {
  var link,
    titleElem = $('a', elem),
    projectElem = $('.epics .project-name');

  link = togglbutton.createTimerLink({
    className: 'taiga',
    buttonType: 'minimal',
    description: titleElem.textContent,
    projectName: projectElem.textContent
  });

  elem.insertBefore(link, $('a', elem));
});

/* Backlog buttons */
togglbutton.render('.user-story-name:not(.toggl)', { observe: true }, function(
  elem
) {
  var link,
    projectElem = $('.backlog .project-name'),
    refElem = $('a > span:nth-child(1)', elem),
    taskElem = $('a > span:nth-child(2)', elem);

  link = togglbutton.createTimerLink({
    className: 'taiga',
    buttonType: 'minimal',
    projectName: projectElem.textContent,
    description: refElem.textContent.trim() + ' ' + taskElem.textContent
  });

  elem.insertBefore(link, $('a', elem));
});

/* Kanban buttons */
togglbutton.render(
  '.kanban .card-title:not(.toggl)',
  { observe: true },
  function(elem) {
    var link,
      refElem = $('a > span:nth-child(1)', elem),
      titleElem = $('a > span:nth-child(2)', elem),
      projectElem = $('.kanban .project-name');

    link = togglbutton.createTimerLink({
      className: 'taiga',
      buttonType: 'minimal',
      description: refElem.textContent + ' ' + titleElem.textContent,
      projectName: projectElem.textContent
    });

    elem.insertBefore(link, $('a', elem));
  }
);

/* Sprint Taskboard tasks buttons */
togglbutton.render(
  '.taskboard .card-title:not(.toggl)',
  { observe: true },
  function(elem) {
    var link,
      refElem = $('.card-title > a > span:nth-child(1)', elem),
      titleElem = $('.card-title > a > span:nth-child(2)', elem),
      projectElem = $('.taskboard .project-name-short');

    link = togglbutton.createTimerLink({
      className: 'taiga',
      buttonType: 'minimal',
      description: refElem.textContent.trim() + ' ' + titleElem.textContent,
      projectName: projectElem.textContent
    });

    elem.insertBefore(link, $('a', elem));
  }
);

/* Issues list buttons */
togglbutton.render(
  '.issues-table .row:not(.toggl)',
  { observe: true },
  function(elem) {
    var link,
      projectElem = $('.issues-page .project-name'),
      refElem = $('a > span:nth-child(1)', elem),
      taskElem = $('a > span:nth-child(2)', elem);

    link = togglbutton.createTimerLink({
      className: 'taiga',
      buttonType: 'minimal',
      projectName: projectElem.textContent,
      description: refElem.textContent.trim() + ' ' + taskElem.textContent
    });

    elem.insertBefore(link, $('.subject', elem));
  }
);
