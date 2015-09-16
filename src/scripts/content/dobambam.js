/*jslint indent: 2 */
/*global $: false, document: false, togglbutton: false*/
'use strict';

togglbutton.render('.taskScroll:not(.toggl)', {observe: true}, function (elem) {
  var link, description, project;

  description = $('.jQ_taskTitleEl a', elem);
  if (!description) {
    description = $('.jQ_taskTitleEl', elem);
  }
  project = $('.txt-gry .jhtmlTicketsTicketViewItem .jQ_trigger', elem);

  link = togglbutton.createTimerLink({
    className: 'dobambam',
    description: description && description.textContent.trim(),
    projectName: project && project.textContent.trim()
  });

  if ($('section.jQ_taskHeader')) {
    $('section.jQ_taskHeader').appendChild(link);
  }

});
