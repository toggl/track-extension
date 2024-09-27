/**
 * @name Hubspot
 * @urlAlias hubspot.com
 * @urlRegex *://app.hubspot.com/*
 */
'use strict';

// This generic implementation works for most objects details page
togglbutton.render(
  'div[data-selenium-component="ProfileHighlightContainer"] [data-selenium-test="highlightTitle"]:not(.toggl)',
  { observe: true },
  $container => {
    try {
      function descriptionSelector() {
        const $description = $('div[data-selenium-test$="-highlight-details"] h3') ?? $('[data-selenium-test="highlightTitle"]');
        return $description.textContent.trim();
      }

      const link = togglbutton.createTimerLink({
        className: 'hubspot',
        description: descriptionSelector,
      });
      const rowContainer = document.createElement('div');
      rowContainer.setAttribute('class', 'flex-row align-center');
      rowContainer.appendChild(link);
      const cardContainer = $('[data-selenium-test="highlightTitle"]')
      cardContainer.parentNode.parentNode.appendChild(rowContainer);
    } catch (e) {
      console.error(e)
    }
  }
);
