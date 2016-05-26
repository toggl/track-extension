/*jslint indent: 2 */
/*global $: false, document: false, togglbutton: false, createTag:false*/
'use strict';

togglbutton.render('#channel_name:not(.toggl)', {observe: true}, function () {
  var link,
    placeholder = $('.channel_title_info'),
    description = $("#channel_name").innerText.trim().substr(1),
    project = $('#team_name').innerText;

  link = togglbutton.createTimerLink({
    className: 'slack',
    description: description,
    projectName: project,
    buttonType: 'minimal'
  });

  placeholder.parentNode.insertBefore(link, placeholder);
});