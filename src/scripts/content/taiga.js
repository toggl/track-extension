/*jslint indent: 2 */
/*global $: false, document: false, togglbutton: false, createTag:false*/

'use strict';

/* User story details button */
togglbutton.render('body:not(.loader-active) .us-detail:not(.toggl)', {observe: true}, function (elem) {
  var link, container = createTag('div', ''),
    titleElem = $('.view-subject', elem),
    projectElem = $('.project-name', elem),
    buttonInsertionPoint = $('.us-story-main-data', elem);

  link = togglbutton.createTimerLink({
    className: 'taiga',
    description: titleElem.textContent,
    projectName: projectElem.textContent
  });

  container.appendChild(link);
  buttonInsertionPoint.appendChild(link);
});

/* Backlog list buttons */
togglbutton.render('.user-story-name:not(.toggl)', {observe: true}, function (elem) {
  var link,
    projectElem = $('.backlog .project-name'),
    //titleElem = $('.window-title-text'),
    taskElem = $('a > span:nth-child(2)', elem);

  link = togglbutton.createTimerLink({
    className: 'taiga-backlog',
    buttonType: 'minimal',
    projectName: projectElem.textContent,
    description: taskElem.textContent
  });

  elem.insertBefore(link, $('a', elem));
});
