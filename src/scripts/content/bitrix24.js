'use strict';
/* global togglbutton, $ */

togglbutton.render(
  '.task-detail .task-view-buttonset:not(.toggl)',
  { observe: true },
  $container => {
    const link = togglbutton.createTimerLink({
      className: 'bitrix24',
      description: descriptionSelector,
      projectName: projectSelector,
      tags: tagsSelector
    });

    $container.appendChild(link);
  }
);

function descriptionSelector() {
  const $description = $('#pagetitle');
  return $description.textContent.trim();
}

function projectSelector() {
  // Avoid invisible field - the project can be removed, but the project name still lingers invisibly in the UI.
  const $project = $(
    '.task-group-field:not(.invisible) .task-group-field-label'
  );
  return $project ? $project.textContent.trim() : '';
}

function tagsSelector() {
  const $tags = $('#task-tags-line');
  return $tags.textContent.split(',').map(tag => tag.trim());
}
