/*jslint indent: 2, plusplus: true */
/*global $: false, document: false, togglbutton: false, createTag:false, window: false, MutationObserver: false */

'use strict';

togglbutton.render('.work-item-form-main-core:not(.toggl)', {observe: true}, function () {
  var link,
    description = document.querySelector('.work-item-form-title input').value,
    project = document.querySelector('.work-item-form-areaIteration input').value,
    destinationContainer = document
      .querySelector('.work-item-form-header-controls-container:not(.toggl)');

  link = togglbutton.createTimerLink({
    className:   'visual-studio-online',
    description: description,
    projectName: project
  });

  if (destinationContainer) {
    destinationContainer.appendChild(link);
    destinationContainer.classList.add('toggl');
  }
});
