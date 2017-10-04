/*jslint indent: 2 */
/*global $: false, document: false, togglbutton: false*/

'use strict';

togglbutton.render('#bx-component-scope-bitrix_tasks_widget_buttonstask_1:not(.toggl)', {observe: true}, function (elem) {

  var link, descFunc,
    description = $('.pagetitle').textContent,
    project = $('.task-group-field-label').textContent;

  link = togglbutton.createTimerLink({
    className: 'bitrix24',
    description: description,
    projectName: project
  });

  elem.appendChild(link);
});
