/*jslint indent: 2 */
/*global $: false, document: false, togglbutton: false*/
'use strict';

// List items
togglbutton.render('.task-list-section-collection-list li:not(.toggl)', {observe: true}, function (elem) {
  var link,
    container = $('.content-list-item-label', elem),
    description = $('.content-list-item-name-wrapper', container).textContent;

  // Have to remove the empty character projectName gets at the end
  link = togglbutton.createTimerLink({
    className: 'getflow',
    description: description,
    projectName: $('.task-list-section-header-link').textContent.trim()
  });

  container.appendChild(link);
});

// Right side panel
togglbutton.render('#app-pane .task-pane-name-field-textarea:not(.toggl)', {observe: true}, function (elem) {
  var link,
    container = $('#app-pane .task-details-list'),
    descFunc = function () {
      return elem.value;
    },
    projectFunc = function () {
      return $('#app-pane .task-pane-details-list-link').textContent.trim();
    };

  // Have to remove the empty character projectName gets at the end
  link = togglbutton.createTimerLink({
    className: 'getflow',
    description: descFunc,
    projectName: projectFunc
  });

  container.appendChild(link);
});