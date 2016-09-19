/*jslint indent: 2 */
/*global $: false, document: false, togglbutton: false*/

/* For main task (not a subtask) */
togglbutton.render('.commonInfoTaskDescription:not(.toggl)', {observe: true}, function () {
  'use strict';

  var link, description, project;
  description = $('#essenceTitle') || {};
  project = $('.task-desc-block .value a') || {};

  link = togglbutton.createTimerLink({
    className: 'onlyoffice',
    description: description.textContent,
    projectName: project.textContent,
    buttonType: 'minimal'
  });
  $('.project-title').appendChild(link);
});

/* For subtasks */
togglbutton.render('.subtasks .subtask:not(.toggl):not(.closed)', {observe: true}, function (elem) {
  'use strict';

  var link, description, project, button;
  description = $('.taskName span', elem) || {};
  project = $('.task-desc-block .value a') || {};

  link = togglbutton.createTimerLink({
    className: 'onlyoffice',
    description: description.textContent,
    projectName: project.textContent,
    buttonType: 'minimal'
  });
  elem.insertBefore(link, $('.check', elem));
  button = $('.toggl-button.onlyoffice', elem);
  if (button && button.style) {
    button.style.float = 'left';
  }
});

/* For main project screen */
togglbutton.render('.taskList .task:not(.toggl):not(.closed)', {observe: true}, function (elem) {
  'use strict';

  var link, description, project, button;

  description = $('.taskName a', elem) || {};
  project = $('#essenceTitle') || {};

  link = togglbutton.createTimerLink({
    className: 'onlyoffice',
    description: description.textContent,
    projectName: project.textContent,
    buttonType: 'minimal'
  });
  elem.insertBefore(link, $('.check', elem));
  button = $('.toggl-button.onlyoffice', elem);
  if (button && button.style) {
    button.style.float = 'left';
  }
});