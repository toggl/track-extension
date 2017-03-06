/*jslint indent: 2 */
/*global $: false, document: false, togglbutton: false*/

'use strict';

// Older UI
togglbutton.render('.details-pane-body:not(.toggl)', {observe: true}, function (elem) {

  var link, descFunc, projectFunc,
    container = $('.sticky-view-placeholder', elem),
    description = $('#details_property_sheet_title', elem),
    project = $('#details_pane_project_tokenizer .token_name', elem);

  descFunc = function () {
    return !!description ? description.value : "";
  };

  projectFunc = function () {
    return (project && project.textContent) || ($('.ancestor-projects', elem) && $('.ancestor-projects', elem).textContent) || "";
  };

  link = togglbutton.createTimerLink({
    className: 'asana',
    description: descFunc,
    projectName: projectFunc
  });

  container.parentNode.insertBefore(link, container.nextSibling);
});

// New UI
togglbutton.render('#right_pane__contents .SingleTaskPane:not(.toggl)', {observe: true}, function (elem) {

  var link, descFunc, projectFunc,
    container = $('.SingleTaskTitleRow', elem),
    description = $('.SingleTaskTitleRow .simpleTextarea', elem),
    project = $('.TaskProjectPill-projectName div', elem);

  descFunc = function () {
    return !!description ? description.value : "";
  };

  projectFunc = function () {
    return (project && project.textContent) || ($('.ancestor-projects', elem) && $('.ancestor-projects', elem).textContent) || "";
  };

  link = togglbutton.createTimerLink({
    className: 'asana-new',
    description: descFunc,
    projectName: projectFunc
  });

  container.after(link);
});

// Board view
togglbutton.render('.BoardCard.BoardColumn-item:not(.toggl)', {observe: true}, function (elem) {
  if (!!$('.toggl-button', elem)) {
    return;
  }
  var link,
    container = $('.BoardCardMetadata-left', elem),
    description = $('.BoardCard-name', elem).textContent,
    project = $('#project_pane_header_name').textContent;

  link = togglbutton.createTimerLink({
    className: 'asana-board',
    description: description,
    projectName: project,
    buttonType: 'minimal'
  });

  container.appendChild(link);
});

// Board task detail view
togglbutton.render('.SingleTaskTitleRow:not(.toggl)', {observe: true}, function (elem) {
  if (!!$('.toggl-button', elem)) {
    return;
  }
  var link,
    container = $('.SingleTaskPaneToolbar', elem.parentNode),
    description = $('.SingleTaskTitleRow textarea', elem.parentNode).textContent,
    project = $('.SingleTaskPane-projects .TaskProjectPill-projectName', elem.parentNode).textContent;

  link = togglbutton.createTimerLink({
    className: 'asana-board',
    description: description,
    projectName: project,
    buttonType: 'minimal'
  });

  container.appendChild(link);
});

