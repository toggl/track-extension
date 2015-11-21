/*jslint indent: 2, unparam: true*/
/*global $: false, document: false, togglbutton: false*/
'use strict';

togglbutton.render('#toggl-button-here:not(.toggl)', {}, function (elem) {
  var link, description,
    titleElem = $('td.bug-summary'),
    projectElem = $('td.bug-project');

  description = titleElem.innerText;

  link = togglbutton.createTimerLink({
    className: 'mantishub',
    description: description,
    projectName: projectElem.textContent
  });

  $('#toggl-button-here').appendChild(link);
});
