/*jslint indent: 2 */
/*global $: false, document: false, togglbutton: false*/

'use strict';

togglbutton.render('#task-detail-view:not(.toggl)', {observe: true}, function (elem) {
  var text = $('#tasktitle', elem).innerText,
    project = $('#project-setting input', elem).getAttribute('value'),

    link = togglbutton.createTimerLink({
      className: 'TickTick',
      description: text,
      projectName: project
    });

  $('#tasktitle').appendChild(link);
});
