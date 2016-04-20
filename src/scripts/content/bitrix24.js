/*jslint indent: 2 */
/*global $: false, document: false, togglbutton: false*/

'use strict';

togglbutton.render('#task-view-b-button.start:not(.toggl)', {observe: true}, function (elem) {

  var link, descFunc, projectFunc,
    container = $('#task-view-buttons', elem),
    description = $('#task-detail-description', elem),
    project = $('#task-detail-header-title', elem);

  descFunc = function () {
    return description.value;
  };

  projectFunc = function () {
    return project.value;
  };

  link = togglbutton.createTimerLink({
    className: 'bitrix24',
    description: descFunc,
    projectName: projectFunc
  });

  container.parentNode.insertBefore(link, container.nextSibling);
  
});
