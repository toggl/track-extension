'use strict';
/* global $, togglbutton */

/**
 * Google Calendar Modern
 *
 * Detail view and popup view support.
 *
 * Implementation notes:
 * - The popup view is re-used when a user clicks between each event without
 *   dismissing the popup.
 * - The way Calendar re-uses the popup view causes the .toggl class to
     remain on the popup div.
 * - Detail view's container does not appear to be re-used, so the pseudo-class
 *   selector (i.e. ":not(.toggl)") works for detail view.
 * - When implementing a selector, do not select on an aria-label's value;
 *   i18n will cause that selector to fail.
 */

const notTogglPseudoClass = ':not(.toggl)';
const popupDialogSelector = 'div[data-chips-dialog="true"]';
const detailContainerSelector = 'div[data-is-create="false"]';
const rootLevelSelectors = [
  `${popupDialogSelector}`,
  `${detailContainerSelector}${notTogglPseudoClass}`
].join(',');

togglbutton.render(rootLevelSelectors, { observe: true }, elem => {
  const elemIsPopup = $(popupDialogSelector, elem.parentElement);
  const elemIsDetail = $(detailContainerSelector, elem.parentElement);
  let getDescription;
  let target;

  if (elemIsPopup) {
    // Popup selector reaches here repeatedly, so we need to prevent the
    // creation of more than one Toggl button for a popup view.
    if ($('.toggl-button', elem)) {
      return;
    }

    const closeButton = $('[aria-label]:last-child', elem);

    getDescription = () => {
      const titleSpan = $('span[role="heading"]', elem);
      return titleSpan ? titleSpan.textContent.trim() : '';
    };
    target = closeButton.parentElement.nextSibling; // Left of the left-most action
  } else if (elemIsDetail) {
    const closeButton = $('div[aria-label]', elem);

    getDescription = () => {
      const titleInput = $('input[data-initial-value]', elem);
      return titleInput ? titleInput.value.trim() : '';
    };
    target =
      closeButton.parentElement.nextElementSibling.lastElementChild
        .lastElementChild; // Date(s)/All day section
  }

  if (!target || target.tagName.toLowerCase() !== 'div') {
    // Prevent adding a Toggl button to other dialogs/views, e.g. Create Event
    return;
  }

  const link = togglbutton.createTimerLink({
    className: 'google-calendar-modern',
    description: getDescription
  });

  if (elemIsPopup) {
    target.prepend(link);
  } else if (elemIsDetail) {
    target.appendChild(link);
  }
});
