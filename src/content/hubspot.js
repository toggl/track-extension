/**
 * @name Hubspot
 * @urlAlias hubspot.com
 * @urlRegex *://*.atlassian.com/*
 */
'use strict';

togglbutton.render(
  'div[data-selenium-test="ticket-highlight-details"]:not(.toggl)',
  { observe: true },
  $container => {
    function descriptionSelector () {
      const $description = $('div[data-selenium-test="ticket-highlight-details"] h3');
      return $description.textContent.trim();
    }
    
    function tagsSelector () {
      const pipeline = $('div#pipeline-select') ? $('div#pipeline-select').textContent.trim(): '';
      const stage = $('div#stage-select') ? $('div#stage-select').textContent.trim(): '';
    
      return [pipeline, stage];
    }
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
