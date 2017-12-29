/*jslint indent: 2 */
/*global $: false, document: false, togglbutton: false*/
'use strict';

togglbutton.render('.ha:not(.toggl)', {observe: true}, function (elem) {
  var link,
    description = $('h2', elem),
    project = $('.hX:last-of-type .hN', elem);

  if (!description) {
    return;
  }

  link = togglbutton.createTimerLink({
    className: 'google-mail',
    description: description.textContent,
    projectName: !!project && project.textContent.split('/').pop()
  });

  elem.appendChild(link);
});