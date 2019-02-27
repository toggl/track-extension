'use strict';

togglbutton.render('.taskScroll:not(.toggl)', { observe: true }, function (
  elem
) {
  let description = $('.jQ_taskTitleEl a', elem);
  if (!description) {
    description = $('.jQ_taskTitleEl', elem);
  }
  const project = $('.txt-gry .jhtmlTicketsTicketViewItem .jQ_trigger', elem);

  const link = togglbutton.createTimerLink({
    className: 'dobambam',
    description: description && description.textContent.trim(),
    projectName: project && project.textContent.trim()
  });

  if ($('section.jQ_taskHeader')) {
    $('section.jQ_taskHeader').appendChild(link);
  }
});
