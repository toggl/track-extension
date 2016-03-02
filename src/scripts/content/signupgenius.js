/*jslint indent: 2 */
/*global $: false, document: false, togglbutton: false*/
'use strict';

togglbutton.render('#signUpLists:not(.toggl)', {observe: true}, function (elem) {
  var link,
    description = $('#signUpLists > .panel-body span.text-muted > strong', elem).textContent,
    project = description;

  link = togglbutton.createTimerLink({
    className: 'SignUpGenius',
    description: description,
    projectName: project
  });

  $('#signUpLists > .panel-body span.text-muted > strong').appendChild(link);
});
