'use strict';

togglbutton.render('.issue_view:not(.toggl)', {}, function (elem) {
  const issueId = $('#issue_overview', elem).getAttribute('data-issue-id');
  const description = $('#issue_overview #issue_summary', elem).textContent;

  // find the project dropdown
  // if the dropdown exists, its multiproject
  // otherwise take it from text value
  const projectSelect = $(
    '#project_chooser > form > select[name=current_project]',
    elem
  );
  const project = projectSelect
    ? projectSelect.options[projectSelect.selectedIndex].text
    : $('#project_chooser').textContent.replace(/^\s+Project:\s/, '');

  const link = togglbutton.createTimerLink({
    className: 'eventum',
    description: '#' + issueId + ' ' + description,
    projectName: project
  });

  const container = $('div#issue_menu', elem);
  const spanTag = document.createElement('span');
  container.parentNode.appendChild(spanTag.appendChild(link));
});
