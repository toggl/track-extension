'use strict';

console.log('Toggl Button loaded for kanboard.');

function addTimerLink(elem, description, location) {
  var link,
    text = $(description, elem).textContent;

  link = togglbutton.createTimerLink({
    className: 'kanboard',
    description: text
  });

  $(location, elem).appendChild(link);
}

// dashboard user tasks
togglbutton.render(
  '.sidebar-content .page-header + .table-list .table-list-row:not(.toggl)',
  { observe: true },
  function(elem) {
    addTimerLink(elem, '.table-list-title a', '.table-list-title');
  }
);

// dashboard user tasks subtasks table
togglbutton.render(
  '.sidebar-content .page-header + .table-list .table-list-row .task-list-subtask:not(.toggl)',
  { observe: true },
  function(elem) {
    addTimerLink(elem, '.subtask-title a', '.subtask-time-tracking');
  }
);

// project task list
togglbutton.render(
  '.page > .table-list > .table-list-row:not(.toggl)',
  { observe: true },
  function(elem) {
    addTimerLink(elem, '.table-list-title a', '.table-list-title');
  }
);

// task details page
togglbutton.render('#task-summary:not(.toggl)', { observe: true }, function(
  elem
) {
  if (!$('.buttons-header', elem)) {
    var div = document.createElement('div');
    div.className = 'buttons-header';
    $('.task-summary-container', elem).after(div);
  }
  addTimerLink(elem, 'h2', '.buttons-header');
});

// task details page subtasks table
togglbutton.render(
  '.subtasks-table tbody tr:not(.toggl)',
  { observe: true },
  function(elem) {
    addTimerLink(elem, '.subtask-title a', '.subtask-time-tracking');
  }
);

// task details page subtasks table
togglbutton.render(
  '.ui-tooltip tbody tr + tr:not(.toggl)',
  { observe: true },
  function(elem) {
    var span = document.createElement('span');
    span.setAttribute('style', 'padding-left: 10px');
    $('.subtask-title', elem).after(span);
    addTimerLink(elem, '.subtask-title a', '.subtask-title + span');
  }
);
