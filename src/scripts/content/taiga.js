/*jslint indent: 2 */
/*global $: false, document: false, togglbutton: false, createTag:false*/

'use strict';

/* User story details button */
togglbutton.render('.us-detail:not(.toggl)', {observe: true}, function (elem) {
  var link,
    projectElem,
    refElem,
    titleElem,
    container = $('.us-title-text');

  link = togglbutton.createTimerLink({
    className: 'taiga',
    buttonType: 'minimal',
    description: function () {
      refElem = $('.us-number', elem);
      titleElem = $('.view-subject', elem);
      return refElem.textContent + ' ' + titleElem.textContent;
    },
    projectName: function () {
      projectElem = $('.project-name', elem);
      if (projectElem) {
        return projectElem.textContent;
      }
    }
  });

  container.insertBefore(link, $('.us-number', elem));
});

/* Backlog list buttons */
togglbutton.render('.user-story-name:not(.toggl)', {observe: true}, function (elem) {

  var link,
    projectElem = $('.backlog .project-name'),
    refElem = $('a > span:nth-child(1)', elem),
    taskElem = $('a > span:nth-child(2)', elem);

  link = togglbutton.createTimerLink({
    className: 'taiga-backlog',
    buttonType: 'minimal',
    projectName: projectElem.textContent,
    description: refElem.textContent + ' ' + taskElem.textContent
  });

  elem.insertBefore(link, $('a', elem));
});

/* Kanban button */
togglbutton.render('.kanban-task-inner:not(.toggl)', {observe: true}, function (elem) {
  var link,
    refElem = $('.task-num', elem),
    titleElem = $('.task-name', elem),
    projectElem = $('.kanban .project-name');

  link = togglbutton.createTimerLink({
    className: 'taiga',
    buttonType: 'minimal',
    description: refElem.textContent + ' ' + titleElem.textContent,
    projectName: projectElem.textContent
  });

  elem.appendChild(link);
});

/* Sprint Taskboard tasks button */
togglbutton.render('.taskboard-task-inner:not(.toggl)', {observe: true}, function (elem) {
  var link,
    refElem = $('.task-num', elem),
    titleElem = $('.task-name', elem),
    projectElem = $('.taskboard .project-name-short');

  link = togglbutton.createTimerLink({
    className: 'taiga',
    buttonType: 'minimal',
    description: refElem.textContent + ' ' + titleElem.textContent,
    projectName: projectElem.textContent
  });

  elem.appendChild(link);
});
