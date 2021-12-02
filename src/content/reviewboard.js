/* jslint indent: 2 */
/* global $: false, document: false, togglbutton: false */
'use strict';

togglbutton.render('.review-request:not(.toggl)', { observe: true }, function () {
  const description = $('#field_summary').textContent;
  const projectName = $('#field_repository').textContent;
  const li = document.createElement('li');

  const link = togglbutton.createTimerLink({
    className: 'reviewboard',
    description: description,
    projectName: projectName
  });

  li.appendChild(link);

  $('.review-request-actions-left').appendChild(li);
});
