/*jslint indent: 2, unparam: true*/
/*global $: false, document: false, togglbutton: false*/
'use strict';

togglbutton.render('#issue-header:not(.toggl)', {}, function (elem) {
  var link, description, id,
    numElem = $('.issue-id'),
    titleElem = $('#issue-title'),
    projectElem = $('.repo-link');

  description = titleElem.textContent;
  if (numElem !== null) {
    id = numElem.textContent.trim();
  }

  link = togglbutton.createTimerLink({
    className: 'bitbucket',
    id: id,
    description: description,
    projectName: projectElem && projectElem.textContent
  });

  $('#issue-header').appendChild(link);
});

togglbutton.render('#pull-request-header:not(.toggl)', {}, function (elem) {
  var link, description, id,
    numElem = $('.pull-request-self-link'),
    titleElem = $('.pull-request-title'),
    projectElem = $('.repo-link');

  description = titleElem.textContent;
  if (numElem !== null) {
    id = numElem.textContent;
  }

  link = togglbutton.createTimerLink({
    className: 'bitbucket',
    id: id,
    description: description,
    projectName: projectElem && projectElem.textContent
  });

  $('.pull-request-status').appendChild(link);
});
