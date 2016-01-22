/*jslint indent: 2 */
/*global $: false, document: false, togglbutton: false*/
'use strict';

togglbutton.render('.channel_header:not(.toggl)', {observe: true}, function (elem) {
  var link,
    container = createTag('div', '.toggl_button_link'),
    placeholder = $('.channel_header_actions'),
    description = $('.name', elem).textContent,
    project = $('.team_name', elem).textContent;

  link = togglbutton.createTimerLink({
    className: 'slack',
    description: description,
    projectName: project
  });

  container.appendChild(link);
  placeholder.parentNode.appendChild(container);
});