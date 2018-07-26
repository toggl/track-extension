/* For main task (not a subtask) */
togglbutton.render(
  '.commonInfoTaskDescription:not(.toggl)',
  { observe: true },
  function() {
    'use strict';

    var link, description, project;

    description = $('#essenceTitle');
    description = !!description ? description.textContent.trim() : null;

    project = $('.task-desc-block .value a');
    project = !!project ? project.textContent.trim() : null;

    link = togglbutton.createTimerLink({
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
  function(elem) {
    'use strict';

    var link, description, project, button;

    description = $('.taskName span', elem);
    description = !!description ? description.textContent.trim() : null;

    project = $('.task-desc-block .value a');
    project = !!project ? project.textContent.trim() : null;

    link = togglbutton.createTimerLink({
      className: 'onlyoffice',
      description: description,
      projectName: project,
      buttonType: 'minimal'
    });
    elem.insertBefore(link, $('.check', elem));
    button = $('.toggl-button.onlyoffice', elem);
    if (button && button.style) {
      button.style.float = 'left';
    }
  }
);

/* For main project screen */
togglbutton.render(
  '.taskList .task:not(.toggl):not(.closed)',
  { observe: true },
  function(elem) {
    'use strict';

    var link, description, project, button;

    description = $('.taskName a', elem);
    description = !!description ? description.textContent.trim() : null;

    project = $('#essenceTitle');
    project = !!project ? project.textContent.trim() : null;

    link = togglbutton.createTimerLink({
      className: 'onlyoffice',
      description: description,
      projectName: project,
      buttonType: 'minimal'
    });
    elem.insertBefore(link, $('.check', elem));
    button = $('.toggl-button.onlyoffice', elem);
    if (button && button.style) {
      button.style.float = 'left';
    }
  }
);
