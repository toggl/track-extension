/*jslint indent: 2, unparam: true*/
/*global $: false, document: false, togglbutton: false*/
'use strict';

togglbutton.render('body.controller-issues.action-show h2:not(.toggl)', {}, function (elem) {
  var link, description, id,
    numElem = $('h2'),
    titleElem = $('.subject h3') || "",
    projectElem = $('h1');

  if (!!$('.toggl-button')) {
    return;
  }

  if (!!titleElem) {
    description = titleElem.textContent;
  }

  if (numElem !== null) {
    if (!!description) {
      description = " " + description;
    }
    id = numElem.textContent;
    description = description;
  }

  link = togglbutton.createTimerLink({
    className: 'redmine',
    id: id,
    description: description,
    projectName: projectElem && projectElem.textContent
  });

  $('h2').appendChild(link);
});
