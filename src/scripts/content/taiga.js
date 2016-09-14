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
togglbutton.render('.kanban .card-title:not(.toggl)', {observe: true}, function (elem) {
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
});

/* Sprint Taskboard tasks button */
togglbutton.render('.taskboard .card-title:not(.toggl)', {observe: true}, function (elem) {

  var link,
    refElem = $('.card-title > a > span:nth-child(1)', elem),
    titleElem = $('.card-title > a > span:nth-child(2)', elem),
    projectElem = $('.taskboard .project-name-short');


  link = togglbutton.createTimerLink({
    className: 'taiga',
    buttonType: 'minimal',
    description: refElem.textContent + ' ' + titleElem.textContent,
    projectName: projectElem.textContent
  });

  elem.insertBefore(link, $('a', elem));
});

/* Epics Dashboard */
togglbutton.render('.epic-row .name:not(.toggl)', {observe: true}, function (elem) {

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
