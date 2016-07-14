/*jslint indent: 2, plusplus: true */
/*global $: false, document: false, togglbutton: false, createTag:false, window: false, MutationObserver: false */

'use strict';

togglbutton.render('.witform-layout-content-container:not(.toggl)', {observe: true}, function (elem) {
  var link,
    description = $('.work-item-form-title input', elem).value,
    project = $('.work-item-form-areaIteration input', elem).value,
    container = $('.work-item-form-header-controls-container', elem);

  link = togglbutton.createTimerLink({
    className: 'visual-studio-online',
    description: description,
    projectName: project
  });

  container.appendChild(link);
});
