/*jslint indent: 2, unparam: true*/
/*global $: false, document: false, togglbutton: false*/

'use strict';

togglbutton.render('#issue_view:not(.toggl)', {}, function (elem) {
  var
    projectSelect, project, link, container, spanTag,
    issue_id = $('#issue_overview > div.title > a', elem).innerHTML,
    description = $('#issue_overview div#summary div.display', elem).textContent;

  // find the project dropdown
  projectSelect = $('#project_chooser > form > select[name=current_project]', elem);
  // project is current value
  project = projectSelect.options[projectSelect.selectedIndex].text;

  link = togglbutton.createTimerLink({
    className: 'eventum',
    description: '#' + issue_id + ' ' + description,
    projectName: project
  });

  container = $('#issue_overview div.title', elem);
  spanTag = document.createElement("span");
  container.appendChild(spanTag.appendChild(link));
});
