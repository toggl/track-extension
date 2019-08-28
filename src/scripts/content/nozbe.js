'use strict';

/**
 * Nozbe detail view
 */
togglbutton.render(
  '.details__attributes-right:not(.toggl)',
  { observe: true },
  function renderNozbeDetailView (elem) {
    const description = document.querySelector('.details .details__title-name').innerText.trim();
    const project = document.querySelector('.details .details__attribute-name').innerText.trim();

    const link = togglbutton.createTimerLink({
      className: 'nozbe',
      description: description,
      projectName: project
    });

    const div = document.createElement('div');
    div.classList.add('details__attribute', 'togglContainer');
    div.appendChild(link);
    elem.appendChild(div);
  }
);

/**
 * Nozbe task list
 */
togglbutton.render(
  '.item.task:not(.toggl)',
  { observe: true },
  function renderNozbeList (elem) {
    const description = elem.querySelector('.task__name').innerText.trim();
    const projectName = elem.querySelector('.task__project-name').innerText.trim();

    const link = togglbutton.createTimerLink({
      className: 'nozbe-list',
      buttonType: 'minimal',
      description,
      projectName
    });

    const container = elem.querySelector('.task__icons-right');
    const starIcon = container.querySelector('.task__star');
    container.insertBefore(link, starIcon);
  }
);
