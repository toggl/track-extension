/**
 * @name Hubspot
 * @urlAlias hubspot.com
 * @urlRegex *://app.hubspot.com/*
 */
'use strict';

togglbutton.render(
  'div[data-selenium-test$="-highlight-details"]:not(.toggl)',
  { observe: true },
  $container => {
    try {
      function descriptionSelector() {
        const $description = $('div[data-selenium-test$="-highlight-details"] h3') ?? $('div[data-selenium-test$="highlightTitle"]');
        return $description.textContent.trim();
      }

      function tagsSelector() {
        const pipeline = $('div#pipeline-select') ? $('div#pipeline-select').textContent.trim() : '';
        const stage = $('div#stage-select') ? $('div#stage-select').textContent.trim() : '';

        return [pipeline, stage];
      }

      const link = togglbutton.createTimerLink({
        className: 'hubspot',
        description: descriptionSelector,
        tags: tagsSelector
      });
      const rowContainer = document.createElement('div');
      rowContainer.setAttribute('class', 'flex-row align-center');
      rowContainer.appendChild(link);
      $container.parentNode.appendChild(rowContainer);
    } catch (e) {
      console.error(e)
    }
  }
);
