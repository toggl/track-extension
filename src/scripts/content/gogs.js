/*jslint indent: 2, unparam: true*/
/*global $: false, document: false, togglbutton: false*/

'use strict';

togglbutton.render('#issue-title:not(.toggl)', {observe: true}, function (elem) {
  var link,
    titleElem = $("#issue-title"),
    description = titleElem.textContent.trim(),
    projectElem = $('.issue .header .breadcrumb a:last-child'),
    project;

  description = $(".index").textContent + " " + description;
  project = projectElem.textContent.split(' / ').pop();

  link = togglbutton.createTimerLink({
    className: 'gogs',
    description: description,
    projectName: project
  });

  $('.title h1').appendChild(link);
});
