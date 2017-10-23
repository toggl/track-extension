/*jslint indent: 2 */
/*global $: false, document: false, togglbutton: false*/
'use strict';

togglbutton.render('.sidebar-navigation-row .text-left:not(.toggl)', {observe: true}, function () {
  var link,
    description = document.querySelector(".col-sm-10.video-header-trail-inner").textContent,
    project = document.querySelector('.course-name');

  link = togglbutton.createTimerLink({
    className: 'linuxacademy',
    description: !!description ? description.trim() : "",
    projectName: project && project.textContent
  });

  $('.sidebar-navigation-row .text-left').appendChild(link);
});