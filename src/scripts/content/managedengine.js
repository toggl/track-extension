/*jslint indent: 2, unparam: true*/
/*global $: false, document: false, togglbutton: false*/

'use strict';

togglbutton.render('.requestEditbrsty:not(.toggl)', {observe: true}, function (elem) {
  var link,
    description = $('#requestSubject_ID', elem).textContent,
    project = "Tickets to be Allocated",
    ticketId = $('#requestId', elem).textContent;

    
  link = togglbutton.createTimerLink({
    className: 'managedengine',
    description: ticketId + ' : ' + description,
    projectName: project
  });

  $('#startListMenuItems').appendChild(link);
});