/*jslint indent: 2 */
/*global $: false, togglbutton: false, createTag: false*/

'use strict';

// Jira 2017 board sidebar
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
    className: 'jira2017',
    description: description,
    buttonType: 'minimal',
    projectName: projectElem && projectElem.textContent
  });

  container.appendChild(link);
  numElem.parentNode.appendChild(container);
});

// Jira 2017 sprint modal
togglbutton.render('#ghx-issue-fragment [spacing] a img:not(.toggl)', {observe: true}, function () {
  var link, description,
    rootElem = $('#ghx-issue-fragment'),
    container = createTag('div', 'jira-ghx-toggl-button'),
    titleElem = $('[spacing] h1', rootElem),
    numElem = $('[spacing] a', rootElem),
    projectElem = $('.bgdPDV');

  description = titleElem.textContent;
  if (numElem !== null) {
    description = numElem.textContent + " " + description;
  }

  link = togglbutton.createTimerLink({
    className: 'jira2017',
    description: description,
    buttonType: 'minimal',
    projectName: projectElem && projectElem.textContent
  });

  container.appendChild(link);
  numElem.parentNode.appendChild(container);
});

// Jira 2017 issue page
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
    className: 'jira2017',
    description: description,
    projectName: projectElem && projectElem.textContent
  });

  $('.issue-link').parentElement.appendChild(link);
});

// Jira pre-2017
togglbutton.render('#ghx-detail-issue:not(.toggl)', {observe: true}, function (elem) {
  var link, description,
    container = createTag('div', 'ghx-toggl-button'),
    titleElem = $('[data-field-id="summary"]', elem),
    numElem = $('.ghx-fieldname-issuekey a'),
    projectElem = $('.ghx-project', elem);

  description = titleElem.textContent;
  if (numElem !== null) {
    description = numElem.textContent + " " + description;
  }

  link = togglbutton.createTimerLink({
    className: 'jira',
    description: description,
    projectName: projectElem && projectElem.textContent
  });

  container.appendChild(link);
  $('#ghx-detail-head').appendChild(container);
});

// Jira pre-2017
togglbutton.render('.issue-header-content:not(.toggl)', {observe: true}, function (elem) {
  var link, description, ul, li,
    numElem = $('#key-val', elem),
    titleElem = $('#summary-val', elem) || "",
    projectElem = $('#project-name-val', elem);

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

  ul = createTag('ul', 'toolbar-group');
  li = createTag('li', 'toolbar-item');
  li.appendChild(link);
  ul.appendChild(li);
  $('.toolbar-split-left').appendChild(ul);
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