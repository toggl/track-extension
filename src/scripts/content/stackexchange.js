/*jslint indent: 2 */
/*global $: false, document: false, togglbutton: false*/
'use strict';

togglbutton.render('#question-header:not(.toggl)', {observe: false}, function (elem) {
  var link,
    description = $('.question-hyperlink', elem).textContent,
    project = 'Stack Exchange';

  link = togglbutton.createTimerLink({
    className: 'stackexchange',
    description: description,
    projectName: project
  });

  $('.post-menu').appendChild(link);
});