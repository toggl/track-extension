/*jslint indent: 2 */
/*global $: false, document: false, togglbutton: false*/

'use strict';

togglbutton.render('.popup-content:not(.toggl)', {observe: true}, function (elem) {
  var link, titleElem = $('#event-description', elem);
  if (titleElem === null) {
    return;
  }

  link = togglbutton.createTimerLink({
    className: 'teamweek',
    description: titleElem.value,
    projectId: $('#toggl-project-id', elem).value
  });

  $('.task_done_buttons').appendChild(link);
});
