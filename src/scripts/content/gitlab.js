/*jslint indent: 2, unparam: true*/
/*global $: false, document: false, togglbutton: false*/

'use strict';

togglbutton.render('.issue-details .detail-page-description:not(.toggl)', {observe: true}, function (elem) {
  var link, description, id,
    numElem = $(".identifier"),
    titleElem = $(".title", elem),
    projectElem = $("h1 .project-item-select-holder");

  description = titleElem.textContent.trim();

  if (numElem !== null) {
    id = numElem.textContent.split(" ").pop().trim();
    description = description;
  }

  link = togglbutton.createTimerLink({
    className: 'gitlab',
    id: id,
    description: description,
    projectName: projectElem.textContent
  });

  $(".detail-page-header").appendChild(link);
});

togglbutton.render('.merge-request-details .detail-page-description:not(.toggl)', {observe: true}, function (elem) {
  var link, description, id,
    numElem = $(".identifier"),
    titleElem = $(".title", elem),
    projectElem = $("h1 .project-item-select-holder");

  description = titleElem.textContent.trim();
  if (numElem !== null) {
    id = "MR" + numElem.textContent.split(" ").pop().trim().replace("!", "");
  }

  link = togglbutton.createTimerLink({
    className: 'gitlab',
    id: id,
    description: description,
    projectName: projectElem.textContent
  });

  $(".detail-page-header").appendChild(link);
});

