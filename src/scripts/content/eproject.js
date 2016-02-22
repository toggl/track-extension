/*jslint indent: 2 */
/*global $: false, document: false, togglbutton: false*/
'use strict';


togglbutton.render('.single-tasks .right-side:not(.toggl)', {observe: true}, function (elem) {
  var link, description,
    numElem = $('.task-id', elem),
    titleElem = $('.entry-title', elem),
    projectElem = $('.project a span.label');

  description = titleElem.innerText;
  if (numElem !== null) {
    description = numElem.innerText + " " + description;
  }

  link = togglbutton.createTimerLink({
    className: 'eproject',
    description: description,
    projectName: projectElem.innerText
  });

  $('.toggl-timer').appendChild(link);

});