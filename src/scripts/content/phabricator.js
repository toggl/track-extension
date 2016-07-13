/*jslint indent: 2 */
/*global $: false, document: false, togglbutton: false*/
'use strict';

// Workboard view
togglbutton.render('#phabricator-standard-page-body .phui-workpanel-view .phui-object-item:not(.toggl)', {observe: true}, function (elem) {
  var link,
    description = $('.phui-object-item-name', elem).textContent.trim(),
    projectName = $('.phui-crumb-view[href^="/project/view"]:not(.phabricator-last-crumb), .phui-header-view > a').textContent.trim();

  link = togglbutton.createTimerLink({
    className: 'phabricator',
    buttonType: 'minimal',
    description: description,
    projectName: projectName
  });

  $('.phui-object-item-name', elem).appendChild(link);
});

// Task detail view
togglbutton.render('#phabricator-standard-page-body:not(.toggl)', {observe: true}, function (elem) {
  var link,
    desc = elem.querySelector(".phui-two-column-header .phui-header-view .phui-header-header"),
    number = $('.phabricator-last-crumb .phui-crumb-name').textContent.trim(),
    projectName = $('.phabricator-handle-tag-list-item > a');

  projectName = (!!projectName) ? projectName.textContent.trim() : "";

  link = togglbutton.createTimerLink({
    className: 'phabricator',
    description: number + ' ' + desc.textContent,
    projectName: projectName
  });

  desc.appendChild(link);
});
