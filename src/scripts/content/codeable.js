/*jslint indent: 2 */
/*global $: false, document: false, togglbutton: false*/
'use strict';

togglbutton.render('.main__header:not(.toggl)', {observe: true}, function (elem) {
  var link,
    description = $('div', elem).textContent,
    project = $('h3', elem).textContent;

  link = togglbutton.createTimerLink({
    className: 'codeable',
    description: description,
    projectName: project
  });

  $('.task-developer .body').appendChild(link);
});
