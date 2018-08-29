'use strict';

//On premise installation
togglbutton.render('.requestEditbrsty:not(.toggl)', { observe: true }, function(
  elem
) {
  var link,
    description = $('#requestSubject_ID', elem).textContent,
    project = 'Tickets to be Allocated',
    ticketId = $('#requestId', elem).textContent,
    togglCell = document.createElement('td');

  link = togglbutton.createTimerLink({
    className: 'manageengine',
    description: ticketId + ' : ' + description,
    projectName: project
  });

  togglCell.appendChild(link);

  $('td#startListMenuItems > table > tbody > tr').appendChild(togglCell);
});

//Cloud version
togglbutton.render(
  '#WorkOrderDetailsTable_CT:not(.toggl)',
  { observe: true },
  function(elem) {
    var link,
      description = $('#details-middle-container h1', elem).textContent,
      projectElem = $('#projectholder p') || {},
      project = projectElem.textContent,
      ticketId = $('#reqid', elem).textContent,
      togglCell = document.createElement('li');

    link = togglbutton.createTimerLink({
      className: 'manageengine',
      description: ticketId + ': ' + description,
      projectName: project
    });

    togglCell.appendChild(link);

    $('#details-middle-container ul.reply-actions').appendChild(togglCell);
  }
);
