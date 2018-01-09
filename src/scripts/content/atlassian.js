/*jslint indent: 2 */
/*global $: false, togglbutton: false, createTag: false*/

'use strict';

// Jira
togglbutton.render('#ghx-detail-view [spacing] h1:not(.toggl)', {observe: true}, function () {
  var link, description,
    rootElem = $('#ghx-detail-view'),
    container = createTag('div', 'jira-ghx-toggl-button'),
    titleElem = $('[spacing] h1', rootElem),
    numElem = $('[spacing] a', rootElem),
    projectElem = $('.bgdPDV');

  description = titleElem.textContent;
  if (numElem !== null) {
    description = numElem.textContent + " " + description;
  }

  link = togglbutton.createTimerLink({
    className: 'jira',
    description: description,
    buttonType: 'minimal',
    projectName: projectElem && projectElem.textContent
  });

  container.appendChild(link);
  numElem.parentNode.appendChild(container);
});

// Jira
togglbutton.render('.issue-header-content:not(.toggl)', {observe: true}, function (elem) {
  var link, description,
    numElem = $('#key-val', elem),
    titleElem = $('#summary-val', elem) || "",
    projectElem = $('.bgdPDV');

  if (!!titleElem) {
    description = titleElem.textContent;
  }

  if (numElem !== null) {
    if (!!description) {
      description = " " + description;
    }
    description = numElem.textContent + description;
  }

  link = togglbutton.createTimerLink({
    className: 'jira',
    description: description,
    projectName: projectElem && projectElem.textContent
  });

  $('.issue-link').parentElement.appendChild(link);
});


//Confluence
togglbutton.render('#title-heading:not(.toggl)', {observe: true}, function (elem) {
  var link, description,
    titleElem = $('[id="title-text"]', elem);

  description = titleElem.textContent;

  link = togglbutton.createTimerLink({
    className: 'confluence',
    description: description
  });

  $('#title-text').appendChild(link);
});