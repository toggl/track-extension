/*jslint indent: 2 */
/*global $: false, document: false, togglbutton: false*/
'use strict';

// Workboard view
togglbutton.render('#phabricator-standard-page-body .phui-workpanel-view .phui-object-item:not(.toggl)', {observe: true}, function (elem) {
  var link,
    description = $('.phui-object-item-name', elem).textContent,
    projectName = $('.phui-crumb-view[href^="/project/view"]:not(.phabricator-last-crumb)').textContent.trim();

  link = togglbutton.createTimerLink({
    className: 'phabricator',
    buttonType: 'minimal',
    description: description,
    projectName: projectName
  });

  $('.phui-object-item-name', elem).appendChild(link);
});

// Task detail view
togglbutton.render('.phui-header-header .fa-exclamation-circle:not(.toggl)', {observe: true}, function (elem) {
  var link,
    parent = elem.parentNode,
    description = parent.textContent,
    projectName = $('.phui-side-column .phui-icon-view.fa-briefcase').parentNode.textContent.trim();

  link = togglbutton.createTimerLink({
    className: 'phabricator',
    description: description,
    projectName: projectName
  });

  parent.appendChild(link);
});