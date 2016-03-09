/*jslint indent: 2, unparam: true*/
/*global $: false, document: false, togglbutton: false*/

'use strict';

togglbutton.render('.issue .detail-page-description .title:not(.toggl)', {observe: true}, function (elem) {
  var link, description,
    numElem = $(".identifier"),
    titleElem = $(".issue .detail-page-description .title"),
    projectElem = $('.title').firstChild;

  description = titleElem.textContent.trim();

  if (numElem !== null) {
    description = "#" + numElem.innerText.split("#").pop().trim() + " " + description;
  }
  link = togglbutton.createTimerLink({
    className: 'gitlab',
    description: description,
    projectName: projectElem.textContent.split(' / ').pop().split(' · ')[0]
  });

  $('.issue .detail-page-description h2.title').appendChild(link);
});
