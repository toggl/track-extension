/*jslint indent: 2 */
/*global $: false, document: false, togglbutton: false*/
'use strict';

togglbutton.render('#filter-navigator-container:not(.toggl)', {observe: true}, function () {
  var link, description, id,
    numElem = $('.item-title'),
    titleElem = $('.item-title'),
    projectElem = $('.project-info a');

  description = titleElem.textContent;
  if (numElem !== null) {
    id = numElem.textContent.split(" ")[0];
    description = description.split(" ").splice(1);
  }

  link = togglbutton.createTimerLink({
    className: 'gemini',
    id: id,
    description: description,
    projectName: projectElem.textContent
  });

  $('#filter-navigator-container').parentNode.insertBefore(link, $('#filter-navigator-container'));
});
