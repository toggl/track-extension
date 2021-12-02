/* For main task (not a subtask) */
togglbutton.render(
  '.commonInfoTaskDescription:not(.toggl)',
  { observe: true },
  function () {
    'use strict';
    let description = $('#essenceTitle');
    description = description ? description.textContent.trim() : null;

    let project = $('.task-desc-block .value a');
    project = project ? project.textContent.trim() : null;

    const link = togglbutton.createTimerLink({
      className: 'onlyoffice',
      description: description,
      projectName: project,
      buttonType: 'minimal'
    });
    $('.project-title').appendChild(link);
  }
);

/* For subtasks */
togglbutton.render(
  '.subtasks .subtask:not(.toggl):not(.closed)',
  { observe: true },
  function (elem) {
    'use strict';
    let description = $('.taskName span', elem);
    description = description ? description.textContent.trim() : null;

    let project = $('.task-desc-block .value a');
    project = project ? project.textContent.trim() : null;

    const link = togglbutton.createTimerLink({
      className: 'onlyoffice',
      description: description,
      projectName: project,
      buttonType: 'minimal'
    });
    elem.insertBefore(link, $('.check', elem));
    const button = $('.toggl-button.onlyoffice', elem);
    if (button && button.style) {
      button.style.float = 'left';
    }
  }
);

/* For main project screen */
togglbutton.render(
  '.taskList .task:not(.toggl):not(.closed)',
  { observe: true },
  function (elem) {
    'use strict';
    let description = $('.taskName a', elem);
    description = description ? description.textContent.trim() : null;

    let project = $('#essenceTitle');
    project = project ? project.textContent.trim() : null;

    const link = togglbutton.createTimerLink({
      className: 'onlyoffice',
      description: description,
      projectName: project,
      buttonType: 'minimal'
    });
    elem.insertBefore(link, $('.check', elem));
    const button = $('.toggl-button.onlyoffice', elem);
    if (button && button.style) {
      button.style.float = 'left';
    }
  }
);
