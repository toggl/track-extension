'use strict';

/**
 * Nozbe detail view
 */
togglbutton.render(
  '.details__attributes-right:not(.toggl)',
  { observe: true },
  function renderNozbeDetailView (elem) {
    const description = $('.details .details__title-name').innerText.trim();
    const project = $('.details .details__attribute-name').innerText.trim();

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
    const description = $('.task__name', elem).innerText.trim();
    const projectName = $('.task__project-name', elem).innerText.trim();

    const link = togglbutton.createTimerLink({
      className: 'nozbe-list',
      buttonType: 'minimal',
      description,
      projectName
    });

    const container = $('.task__icons-right', elem);
    const starIcon = $('.task__star', container);
    container.insertBefore(link, starIcon);
  }
);
