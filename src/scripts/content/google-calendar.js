/*jslint indent: 2 */
/*global $: false, document: false, togglbutton: false*/
'use strict';

togglbutton.render('.eb-root:not(.toggl), .ep:not(.toggl)', {observe: true}, function (elem) {
  var link, description, togglButtonElement;

  if ($('.eb-title', elem) !== null) {
    togglButtonElement = $('.eb-date', elem);
    description = $('.eb-title', elem).textContent;
  } else {
    togglButtonElement = $('.ep-dpc .ep-drs', elem);
    description = $('.ep .ep-title input', elem).value;
  }

  link = togglbutton.createTimerLink({
    className: 'google-calendar',
    description: description
  });

  togglButtonElement.appendChild(link);
});