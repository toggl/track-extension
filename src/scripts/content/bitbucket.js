'use strict';

togglbutton.render('#issue-header:not(.toggl)', {}, function(elem) {
  var link,
    description,
    numElem = $('.issue-id'),
    titleElem = $('#issue-title'),
    projectElem = $('.entity-name');

  description = titleElem.textContent;
  if (numElem !== null) {
    description = numElem.textContent.trim() + ' ' + description;
  }

  link = togglbutton.createTimerLink({
    className: 'bitbucket',
    description: description,
    projectName: projectElem && projectElem.textContent.trim()
  });

  $('#issue-header').appendChild(link);
});

togglbutton.render('#pull-request-header:not(.toggl)', {}, function(elem) {
  var link,
    description,
    numElem = $('.pull-request-self-link'),
    titleElem = $('.pull-request-title'),
    projectElem = $('.entity-name'),
    parentToAppendTo = '.pull-request-status';

  if (titleElem !== null) {
    description = titleElem.textContent.trim();
    if (numElem !== null) {
      description = numElem.textContent.trim() + ' ' + description;
    }
  } else {
    // Bitbucket Server support as at version v5.9.0
    description = $('.pr-title-jira-issues-trigger').closest('h2').textContent;
    parentToAppendTo = '.pull-request-metadata';
  }

  link = togglbutton.createTimerLink({
    className: 'bitbucket',
    description: description,
    projectName: projectElem && projectElem.textContent.trim()
  });

  $(parentToAppendTo).appendChild(link);
});
