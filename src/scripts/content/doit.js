/*jslint indent: 2 */
/*global $: false, document: false, togglbutton: false*/
'use strict';

// Add button to task detail view
togglbutton.render('[id^=taskview_task_]:not(.toggl)', {observe: true}, function (elem) {
  var link,
    titleElem   = $('h3 > span.title.ng-binding', elem),
    projectElem = $('div > div.item.project.ng-binding', elem),
    description = !!titleElem ? titleElem.innerHTML : '',
    project = !!projectElem ? projectElem.innerHTML : '',
    firstOp;

  if (description !== '') {
    titleElem.innerHTML = description + ' ';
  }

  if (project !== '') {
    project = project.substring(1);  // remove '#'
  }

  link = togglbutton.createTimerLink({
    className: 'doit',
    description: description,
    projectName: project
  });

  firstOp = $('li.task-op').children[0];
  $('li.task-op').insertBefore(link, firstOp);
});

// Add button to popup form ( like when editing project )
togglbutton.render('#taskform > div > div.taskform-main:not(.toggl)', {observe: true}, function (elem) {
  var link,
    titleElem   = $('li.meta.task-title > div > div > div.textarea-tmp', elem),
    projectElem = $('li.meta.task-project.smart > div > div > ul > li.token > div', elem),
    description = !!titleElem ? titleElem.innerHTML : '',
    project = !!projectElem ? projectElem.innerHTML : '';

  link = togglbutton.createTimerLink({
    className: 'doit',
    description: description,
    projectName: project
  });

  titleElem.parentElement.appendChild(link);
});

// Add button to tasks in the list
togglbutton.render('li.task:not(.toggl)', {observe: true}, function (elem) {
  var link,
    titleElem   = $('div.title > a.link-title', elem),
    projectElem = $('div.title > a.project', elem),
    description = !!titleElem ? titleElem.innerHTML : '',
    project,
    projectHeader = $('#project_info:not(.ng-hide)');

  if (!!projectHeader) {
    project = document.querySelector("#project_info span.title").textContent;
  } else {
    project = !!projectElem ? projectElem.innerHTML : '';
    if (project !== '') {
      project = project.substring(1);  // remove '#'
    }
  }

  if (description !== '') {
    titleElem.innerHTML = description + ' ';
  }

  link = togglbutton.createTimerLink({
    className: 'doit',
    buttonType: 'minimal',
    description: description,
    projectName: project
  });

  titleElem.parentElement.appendChild(link);
});
