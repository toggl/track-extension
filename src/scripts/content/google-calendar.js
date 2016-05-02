/*jslint indent: 2 */
/*global $: false, document: false, togglbutton: false*/
'use strict';

// Detail view
togglbutton.render('.ep:not(.toggl)', {observe: true}, function (elem) {
  var link, description, togglButtonElement;

  togglButtonElement = $('.ep-dpc', elem);
  description = $('.ep-title', elem).textContent;

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