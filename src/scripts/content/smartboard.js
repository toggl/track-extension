/*jslint indent: 2 */
/*global $: false, document: false, togglbutton: false*/
'use strict';

togglbutton.render('.task:not(.toggl)', {observe: true}, function (elem) {
  var link,
    project = $('#project_name', elem),
    refElem = $('.task-id', elem),
    titleElem = $('.task-name', elem);
  link = togglbutton.createTimerLink({
    className: 'smartboard',
    buttonType: 'minimal',
    description: refElem.textContent.replace(/\s+/g, ' ') + ' ' + titleElem.textContent.replace(/\s+/g, ' '),
    projectName: project.value
  });

  $('.toggle-container', elem).appendChild(link);
});