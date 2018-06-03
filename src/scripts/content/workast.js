/*jslint indent: 2 */
/*global $: false, document: false, togglbutton: false, createTag: false*/
'use strict';

/* Checklist buttons */
togglbutton.render('a.task-list__item:not(.toggl)', {observe: true}, function (elem) {
  var link,
    titleElem = $('.item__title',elem),
    titleContainer = $('.layout-column',elem),
    projectContainer = $('.task-list__title .ng-binding',elem.closest('.task-list__container'));
  
  if (!projectContainer) {
    return;
  }

  link = togglbutton.createTimerLink({
    className: 'workast',
    buttonType: 'minimal',
    description: titleElem.textContent.trim(),
    projectName: projectContainer.textContent.trim()
  });

  titleContainer.parentNode.insertBefore(link, titleContainer);
});