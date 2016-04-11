/*jslint indent: 2 */
/*global $: false, document: false, togglbutton: false*/
'use strict';

// Detail view
togglbutton.render('.eb-root:not(.toggl), .ep:not(.toggl)', {observe: true}, function (elem) {
  var link, description, togglButtonElement;

  if ($('.eb-title', elem) !== null) {
    togglButtonElement = $('.eb-date', elem);
    description = $('.eb-title', elem).textContent;
  } else {
    togglButtonElement = $('.ep-dpc', elem);
    description = $('.ep .ep-title input', elem).value;
  }

  link = togglbutton.createTimerLink({
    className: 'google-calendar',
    description: description
  });

  togglButtonElement.appendChild(link);
});


// Popup view
togglbutton.render('#mtb:not(.toggl)', {observe: true}, function (elem) {
  var link;

  link = togglbutton.createTimerLink({
    className: 'google-calendar',
    description: elem.textContent
  });

  elem.parentNode.insertBefore(link, elem.nextSibling);
});