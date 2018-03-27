/*jslint indent: 2, plusplus: true */
/*global $: false, document: false, togglbutton: false, createTag:false, window: false, MutationObserver: false */
'use strict';

// Individual Work Item & Backlog page
togglbutton.render('.witform-layout-content-container:not(.toggl)', {observe: true}, function () {
  var link,
    description = $('.work-item-form-id span').innerText + ' ' + $('.work-item-form-title input').value,
    project = $('.menu-item.l1-navigation-text.drop-visible .text').textContent.trim(),
    container = $('.work-item-form-header-controls-container'),
    vs_activeClassContent = $('.hub-list .menu-item.currently-selected').textContent.trim();

  link = togglbutton.createTimerLink({
    className: 'visual-studio-online',
    description: description,
    projectName: project
  });

  if (vs_activeClassContent === "Work Items*" || vs_activeClassContent === "Backlogs") {
    container.appendChild(link);
  }
});
