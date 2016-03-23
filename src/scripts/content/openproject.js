/*jslint indent: 2 */
/*global $: false, document: false, togglbutton: false*/
'use strict';

// Work packages list items
togglbutton.render('#work-packages-index table tbody tr:not(.toggl)', {observe: true}, function (elem) {
  var link,
    container = $('.checkbox .accessible-checkbox', elem),
    description = $('td.subject', elem).textContent.trim(),
    projectName = $('.breadcrumb-project-title').textContent.trim();

  link = togglbutton.createTimerLink({
    className: 'openproject',
    description: description,
    projectName: projectName,
    buttonType: "minimal"
  });

  container.appendChild(link);
});

// Work packages details view
togglbutton.render('.work-packages--page-container:not(.toggl)', {observe: true}, function (elem) {
  var link,
    container = $('.subject-header', elem),
    description = $('#work-package-subject .inplace-edit--read-value').textContent.trim(),
    projectName = $('.breadcrumb-project-title').textContent.trim();

  link = togglbutton.createTimerLink({
    className: 'openproject',
    description: description,
    projectName: projectName
  });

  container.appendChild(link);
});