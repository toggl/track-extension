/*jslint indent: 2, unparam: true*/
/*global $: false, document: false, togglbutton: false*/

'use strict';

togglbutton.render('.content .page-title:not(.toggl)', {observe: true}, function (elem) {
  var link,  description,
    numElem = $('.page-title'),
    titleElem = $(".issue-box .title, .issue-title"),
    projectElem = $('.title').firstChild;

  description = titleElem.textContent;
  description = numElem.firstChild.textContent.trim() + " " + description.trim();

  link = togglbutton.createTimerLink({
    className: 'gitlab',
    description: description,
    projectName: projectElem.textContent.split(' / ').pop()
  });

  $('.content .page-title').appendChild(link);
});
