'use strict';
/* global togglbutton, $ */

togglbutton.render(
  '.cardeditor .cardeditor-topbar .buttons:not(.toggl)',
  { observe: true },
  $container => {
    const link = togglbutton.createTimerLink({
      className: 'favro',
      description: descriptionSelector,
      projectName: projectSelector,
      tags: tagsSelector
    });

    $container.appendChild(link);
  }
);

function descriptionSelector () {
  const $description = $('textarea.card-details-title');
  return $description.value.trim();
}

function projectSelector () {
  // Avoid invisible field - the project can be removed, but the project name still lingers invisibly in the UI.
  const $project = $('.workspace-collection-title-text');
  return $project.textContent.trim();
}

function tagsSelector () {
  const tags = document.querySelectorAll('.token-tag .name');
  return tags ? Array.from(tags).map(tag => tag.textContent.trim()) : null;
}
