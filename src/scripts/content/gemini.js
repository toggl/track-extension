/*jslint indent: 2 */
/*global $: false, document: false, togglbutton: false*/
'use strict';

togglbutton.render('#filter-navigator-container:not(.toggl)', {observe: true}, function () {
  var link, description,
    numElem = $('.item-title'),
    titleElem = $('.item-title'),
    projectElem = $('.project-info a');

  description = titleElem.innerText;
  if (numElem !== null) {
    description = numElem.innerText + " " + description;
  }

  link = togglbutton.createTimerLink({
    className: 'gemini',
    description: description,
    projectName: projectElem.innerText
  });

  $('#filter-navigator-container').parentNode.insertBefore(link, $('#filter-navigator-container'));
});
