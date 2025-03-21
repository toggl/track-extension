'use strict'
/* global $, togglbutton */

/**
 * Google Calendar Modern
 *
 * Detail view and popup view support.
 *
 * Implementation notes:
 *
 * - The popup view is re-used when a user clicks between each event without
 *   dismissing the popup.
 * - The way Calendar re-uses the popup view causes the .toggl class to remain on
 *   the popup div.
 * - Detail view's container does not appear to be re-used, so the pseudo-class
 *   selector (i.e. ":not(.toggl)") works for detail view.
 * - When implementing a selector, do not select on an aria-label's value; i18n
 *   will cause that selector to fail.
 * - Mutation observer to the document body to intercept the time entry edit
 *   component pointerdown event which is closing google calendar popup view.
 */

const popupDialogSelector = 'div[data-chips-dialog="true"]'
const detailContainerSelector = 'div[data-is-create="false"]'
const rootLevelSelectors = [
  `${popupDialogSelector}`,
  `${detailContainerSelector}:not(.toggl)`,
].join(',')

// Function to intercept pointerdown events inside the form component
function interceptPointerdownEvents(form) {
  const stopEvent = (e) => {
    e.preventDefault() // Prevent default to stop the popup from closing

    if (e.target.focus) {
      e.target.focus()
    }
  }

  // Intercept only pointerdown events within the form
  form.addEventListener('pointerdown', stopEvent, true)
}

function initializeObserver(popupElement) {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          const homeRootElement = node.querySelector('#homeRoot')
          if (homeRootElement) {
            interceptPointerdownEvents(homeRootElement)
          }
        }
      })

      // Disconnect observer when the popup element is removed
      mutation.removedNodes.forEach((node) => {
        if (node.contains(popupElement)) {
          observer.disconnect()
        }
      })
    })
  })

  // Observe the entire document body for changes, the time entry edit component is a child of the body
  observer.observe(document.body, { childList: true, subtree: true })
}

function initializePopup(elem) {
  if (elem.querySelector('.toggl-button')) {
    return // Prevent adding duplicate buttons
  }

  initializeObserver(elem)

  const closeButton = $('[aria-label]:first-child', elem)
  const getDescription = () => {
    const titleSpan = $('span[role="heading"]', elem)
    return titleSpan ? titleSpan.textContent.trim() : ''
  }

  const target = closeButton.parentElement.parentElement.nextSibling // Left of the left-most action
  if (target && target.tagName.toLowerCase() === 'div') {
    addTogglButton(target, getDescription, 'popup')
  }
}

function initializeDetailView(elem) {
  const closeButton = $('button[data-use-native-focus-logic]', elem)
  const getDescription = () => {
    const titleInput = $('input[data-initial-value]', elem)
    return titleInput ? titleInput.value.trim() : ''
  }

  const target =
    closeButton.parentElement.parentElement.parentElement.parentElement
      .nextElementSibling.firstElementChild.nextElementSibling.lastElementChild // Date(s)/All day section
  if (target && target.tagName.toLowerCase() === 'div') {
    addTogglButton(target, getDescription, 'detail')
  }
}

function addTogglButton(target, getDescription, context) {
  const link = togglbutton.createTimerLink({
    className: 'google-calendar-modern',
    description: getDescription,
  })

  const container = createTag('view', 'toggl-container')
  container.appendChild(link)
  target.prepend(container)
}

togglbutton.render(rootLevelSelectors, { observe: true }, function (elem) {
  const elemIsPopup = elem.closest(popupDialogSelector)
  const elemIsDetail = elem.closest(detailContainerSelector)
  if (elemIsPopup) {
    initializePopup(elem)
  } else if (elemIsDetail) {
    initializeDetailView(elem)
  }
})
