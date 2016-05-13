/*jslint indent: 2 */
/*global $: false, document: false, togglbutton: false*/
'use strict';

// Phacility Workboard view
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
  var link, index, description_elem,
    parent = elem.parentNode,
    description = elem.querySelectorAll('.phui-header-header, .phui-header-view'),
    number = $('.phabricator-last-crumb .phui-crumb-name').textContent.trim(),
    projectName = $('.phabricator-handle-tag-list-item > a').textContent.trim();

  if (description.length == 4) {
    description_elem = description[1];
    description = description_elem.textContent.trim();
  } else {
    description_elem = description[0];
    description = description_elem.textContent.trim();
  }


  link = togglbutton.createTimerLink({
    className: 'phabricator',
    description: number + ' ' + description,
    projectName: projectName
  });

  description_elem.appendChild(link);
});
