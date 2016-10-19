/*jslint indent: 2 */
/*global $: false, document: false, togglbutton: false*/
'use strict';


togglbutton.render('.single-tasks .right-side:not(.toggl)', {observe: true}, function (elem) {
  var link, description,
    numElem = $('.task-id', elem),
    titleElem = $('.entry-title', elem),
    projectElem = $('.project a span.label');

  description = titleElem.textContent;
  if (numElem !== null) {
    description = numElem.textContent + " " + description;
  }

  link = togglbutton.createTimerLink({
    className: 'eproject',
    description: description,
    projectName: projectElem.textContent
  });

  $('.toggl-timer').appendChild(link);

});