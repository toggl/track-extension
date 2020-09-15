'use strict';
/* global togglbutton, $ */

togglbutton.render(
  'div[data-selenium-test="ticket-highlight-details"]:not(.toggl)',
  { observe: true },
  $container => {
    const link = togglbutton.createTimerLink({
      className: 'hubspot',
      project: 'Hubspot',
      description: descriptionSelector,
      tags: tagsSelector
    });
    const rowContainer = document.createElement('div');
    rowContainer.setAttribute('class', 'flex-row align-center');
    rowContainer.appendChild(link);
    $container.appendChild(rowContainer);
  }
);

function descriptionSelector () {
  const $description = $('div[data-selenium-test="ticket-highlight-details"] h3');
  return $description.textContent.trim();
}

function tagsSelector () {
  const pipeline = $('div#pipeline-select').textContent.trim();
  const stage = $('div#stage-select').textContent.trim();

  return [pipeline, stage];
}
