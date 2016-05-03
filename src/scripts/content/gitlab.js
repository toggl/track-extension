/*jslint indent: 2, unparam: true*/
/*global $: false, document: false, togglbutton: false*/

'use strict';

togglbutton.render('.issue-details .detail-page-description:not(.toggl)', {observe: true}, function (elem) {
  var link, description,
    numElem = $(".identifier"),
    titleElem = $(".title", elem),
    projectElem = $("h1 .project-item-select-holder");

  description = titleElem.textContent.trim();

  if (numElem !== null) {
    description = numElem.innerText.split(" ").pop().trim() + " " + description;
  }

  link = togglbutton.createTimerLink({
    className: 'gitlab',
    description: description,
    projectName: projectElem.textContent
  });

  $(".detail-page-header").appendChild(link);
});
