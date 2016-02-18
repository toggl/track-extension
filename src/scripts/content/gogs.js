/*jslint indent: 2, unparam: true*/
/*global $: false, document: false, togglbutton: false*/

'use strict';

togglbutton.render('#issue-title:not(.toggl)', {observe: true}, function (elem) {
  var link, description,
    titleElem = $("#issue-title"),
    projectElem = $('.issue .header .breadcrumb a:last-child');
  description = titleElem.textContent;
  description = description.trim();
  description = $(".index").textContent + " " + description;
  var project = projectElem.textContent.split(' / ').pop();
  link = togglbutton.createTimerLink({
    className: 'gitlab',
    description: description,
    projectName: project
  });
  link.title = project+": "+description;
  $('.title h1').appendChild(link);
});
