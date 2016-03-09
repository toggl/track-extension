/*jslint indent: 2, unparam: true*/
/*global $: false, document: false, togglbutton: false*/
'use strict';

togglbutton.render('#viewTask-infoSummary:not(.toggl)', {observe: true}, function (elem) {

  var link,
    projectNr = elem.querySelector('dd').innerText,
    project = $('#viewTask-projectName', elem).innerText,
    title = $('h2', elem).innerText,
    description = projectNr + " - " + project + " : " + title;

  link = togglbutton.createTimerLink({
    className: 'proworkflow',
    description: description,
    projectName: projectNr + " - " + project
  });

  elem.appendChild(link);
});
