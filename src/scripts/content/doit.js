'use strict';

// Add button to task detail view
togglbutton.render(
  '[id^=taskview_task_]:not(.toggl)',
  { observe: true },
  function (elem) {
    const titleElem = $('h3 > span.title.ng-binding', elem);
    const projectElem = $('div > div.item.project.ng-binding', elem);
    const description = titleElem ? titleElem.textContent : '';
    let project = projectElem ? projectElem.textContent : '';

    if (project !== '') {
      project = project.substring(1); // remove '#'
    }

    const link = togglbutton.createTimerLink({
      className: 'doit',
      description: description,
      projectName: project
    });

    const firstOp = $('li.task-op').children[0];
    $('li.task-op').insertBefore(link, firstOp);
  }
);

// Add button to popup form ( like when editing project )
togglbutton.render(
  '#taskform > div > div.taskform-main:not(.toggl)',
  { observe: true },
  function (elem) {
    const titleElem = $('li.meta.task-title > div > div > div.textarea-tmp', elem);
    const projectElem = $(
      'li.meta.task-project.smart > div > div > ul > li.token > div',
      elem
    );
    const description = titleElem ? titleElem.textContent : '';
    const project = projectElem ? projectElem.textContent : '';

    const link = togglbutton.createTimerLink({
      className: 'doit',
      description: description,
      projectName: project
    });

    titleElem.parentElement.appendChild(link);
  }
);

// Add button to tasks in the list
togglbutton.render('li.task:not(.toggl)', { observe: true }, function (elem) {
  const titleElem = $('div.title > a.link-title', elem);
  const projectElem = $('div.title > a.project', elem);
  const description = titleElem ? titleElem.textContent : '';
  const projectHeader = $('#project_info:not(.ng-hide)');
  let project;

  if (projectHeader) {
    project = document.querySelector('#project_info span.title').textContent;
  } else {
    project = projectElem ? projectElem.textContent : '';
    if (project !== '') {
      project = project.substring(1); // remove '#'
    }
  }

  const link = togglbutton.createTimerLink({
    className: 'doit',
    buttonType: 'minimal',
    description: description,
    projectName: project
  });

  titleElem.parentElement.appendChild(link);
});
