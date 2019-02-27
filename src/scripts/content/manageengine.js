'use strict';

// On premise installation
togglbutton.render('.requestEditbrsty:not(.toggl)', { observe: true }, function (
  elem
) {
  const description = $('#requestSubject_ID', elem).textContent;
  const project = 'Tickets to be Allocated';
  const ticketId = $('#requestId', elem).textContent;
  const togglCell = document.createElement('td');

  const link = togglbutton.createTimerLink({
    className: 'manageengine',
    description: ticketId + ' : ' + description,
    projectName: project
  });

  togglCell.appendChild(link);

  $('td#startListMenuItems > table > tbody > tr').appendChild(togglCell);
});

// Cloud version
togglbutton.render(
  '#WorkOrderDetailsTable_CT:not(.toggl)',
  { observe: true },
  function (elem) {
    const description = $('#details-middle-container h1', elem).textContent;
    const projectElem = $('#projectholder p') || {};
    const project = projectElem.textContent;
    const ticketId = $('#reqid', elem).textContent;
    const togglCell = document.createElement('li');

    const link = togglbutton.createTimerLink({
      className: 'manageengine',
      description: ticketId + ': ' + description,
      projectName: project
    });

    togglCell.appendChild(link);

    $('#details-middle-container ul.reply-actions').appendChild(togglCell);
  }
);
