/*jslint indent: 2 */
/*global $: false, document: false, togglbutton: false*/
'use strict';

togglbutton.render('.ha:not(.toggl)', {observe: true}, function (elem) {
  var link,
    description = $('h2', elem).textContent,
    project = $('.hX:last-of-type .hN', elem).textContent.split('/').pop();

  link = togglbutton.createTimerLink({
    className: 'google-mail',
    description: description,
    projectName: project
  });

  elem.appendChild(link);
});