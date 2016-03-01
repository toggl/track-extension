/*jslint indent: 2 */
/*global $: false, document: false, togglbutton: false*/
'use strict';

togglbutton.render('[id^=contentListItem]:not(.toggl)', {observe: true}, function (elem) {
  var link,
    description = $("div", elem).textContent.trim(),
    project = $("#pageTitleText").textContent;

  link = togglbutton.createTimerLink({
    className: 'blackboard',
    description: description,
    projectName: project
  });

  $('.details', elem).appendChild(link);
});