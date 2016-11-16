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
