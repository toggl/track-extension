/*jslint indent: 2 */
/*global $: false, document: false, togglbutton: false*/
'use strict';

togglbutton.render('.bJ:not(.toggl)', {observe: true}, function (elem) {
  var link,
    description = $('.eo > span', elem).textContent,
    toolbar = $('.cp', elem);

  link = togglbutton.createTimerLink({
    className: 'google-inbox',
    description: description
  });

  toolbar.parentElement.insertBefore(link, toolbar);
});