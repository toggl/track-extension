/**
 * @name Hubspot
 * @urlAlias hubspot.com
 * @urlRegex *://app.hubspot.com/*
 */
'use strict'

// This generic implementation works for most objects details page
togglbutton.render(
  '[data-card-type="OBJECT_HIGHLIGHT"]:not(.toggl)',
  { observe: true },
  ($container) => {
    try {
      const cardContainer = $('[data-selenium-test="highlightTitle"]')
      if (!cardContainer) return;
      const parent = cardContainer.parentNode.parentNode.parentNode
      // Check for existing button at the actual insertion point, not inside $container
      if (parent.parentNode.querySelector('.toggl-button')) return;

      function descriptionSelector() {
        const $description =
          $('div[data-selenium-test$="-highlight-details"] h3') ??
          $('[data-selenium-test="highlightTitle"]')
        return $description.textContent.trim()
      }

      const link = togglbutton.createTimerLink({
        className: 'hubspot',
        description: descriptionSelector,
        autoTrackable: true,
      })
      const rowContainer = document.createElement('div')
      rowContainer.setAttribute('class', 'flex-row align-center')
      rowContainer.appendChild(link)
      parent.insertAdjacentElement('afterend', rowContainer)
    } catch (e) {
      console.error(e)
    }
  },
)

// This generic implementation works for most objects details page
togglbutton.render(
  'td[data-table-external-id*="name-"]:not(.toggl)',
  { observe: true },
  ($container) => {
    try {
      if ($container.querySelector('.toggl-button')) return;

      function descriptionSelector() {
        return $(
          '[data-test-id="truncated-object-label"]',
          $container,
        ).textContent.trim()
      }

      const link = togglbutton.createTimerLink({
        className: 'hubspot-list-item',
        description: descriptionSelector,
        buttonType: 'minimal',
      })
      const rowContainer = document.createElement('div')
      rowContainer.setAttribute('class', 'flex-row align-center')
      rowContainer.appendChild(link)
      $('.media', $container).prepend(rowContainer)
    } catch (e) {
      console.error(e)
    }
  },
)
