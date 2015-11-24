/*jslint indent: 2, unparam: true*/
/*global $: false, document: false, togglbutton: false*/
'use strict';

togglbutton.render('#issue-header', {}, function (elem) {
  var link, description,
    numElem = $('.issue-id'),
    titleElem = $('#issue-title'),
    projectElem = $('.repo-link');

  description = titleElem.innerText;
  if (numElem !== null) {
    description = numElem.innerText + " " + description;
  }

  link = togglbutton.createTimerLink({
    className: 'bitbucket',
    description: description,
    projectName: projectElem && projectElem.textContent
  });

  $('#issue-header').appendChild(link);
});

togglbutton.render('#pull-request-header', {}, function (elem) {
  var link, description,
    numElem = $('.pull-request-self-link'),
    titleElem = $('.pull-request-title'),
    projectElem = $('.repo-link');

  description = titleElem.innerText;
  if (numElem !== null) {
    description = numElem.innerText + " " + description;
  }

  link = togglbutton.createTimerLink({
    className: 'bitbucket',
    description: description,
    projectName: projectElem && projectElem.textContent
  });

  $('.compare-widget-container').insertBefore(link, $('#branch-details-template'));
});
