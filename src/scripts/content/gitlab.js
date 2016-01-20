/*jslint indent: 2, unparam: true*/
/*global $: false, document: false, togglbutton: false*/

'use strict';

togglbutton.render('.issue .detail-page-description .title:not(.toggl)', {observe: true}, function (elem) {
  var link, description,
    titleElem = $(".issue .detail-page-description .title"),
    projectElem = $('.title').firstChild;
  description = titleElem.textContent;
  description = description.trim();

  link = togglbutton.createTimerLink({
    className: 'gitlab',
    description: description,
    projectName: projectElem.textContent.split(' / ').pop()
  });

  $('.issue .detail-page-description h2.title').appendChild(link);
});
