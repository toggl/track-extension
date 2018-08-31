/*jslint indent: 2 */
/*global $: false, document: false, togglbutton: false*/
'use strict';
togglbutton.render('.alert-detail-cover .area-second :not(.toggl)', {observe: true}, function (elem) {
  var descriptionElem = $('.alert-detail-cover .main-cover .item-message b:nth-child(2)', elem);
  if (descriptionElem === null) {
    return;
  }
  var link,
    description = descriptionElem.textContent.trim(),
    project = $('.alert-detail-content-wrapper .row-item:nth-child(4) .row-description').textContent.trim();
  link = togglbutton.createTimerLink({
    className: 'opsgenie',
    description: description,
    projectName: project
  });

  elem.appendChild(link);
});
