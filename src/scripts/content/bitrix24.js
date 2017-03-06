/*jslint indent: 2 */
/*global $: false, document: false, togglbutton: false*/

'use strict';

togglbutton.render('#task-view-buttons.start:not(.toggl)', {observe: true}, function (elem) {

  var link, descFunc,
    description = $('.task-detail-header-title'),
    project = $('.task-group-field-label').textContent;

  descFunc = function () {
    if (!!description) {
      return description.textContent;
    }
    return null;
  };

  link = togglbutton.createTimerLink({
    className: 'bitrix24',
    description: descFunc,
    projectName: project
  });

  elem.appendChild(link);
});