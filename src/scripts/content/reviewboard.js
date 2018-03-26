/*jslint indent: 2 */
/*global $: false, document: false, togglbutton: false*/
'use strict';

togglbutton.render('.review-request:not(.toggl)', {observe: true}, function () {

  var link,
    description = $('#field_summary').textContent,
    projectName = $('#field_repository').textContent,
    li = document.createElement("li");

  link = togglbutton.createTimerLink({
    className: 'reviewboard',
    description: description,
    projectName: projectName
  });

  li.appendChild(link);

  $('.review-request-actions-left').appendChild(li);
});
