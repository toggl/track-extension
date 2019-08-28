'use strict';
/* global $, togglbutton */

// Popup view Google Calendar Modern
togglbutton.render('div[data-chips-dialog="true"]', { observe: true }, elem => {
  // We manually check for presence of button, as one popup element
  // gets recycled by calendar when clicking between different calendar entries.
  if ($('.toggl-button', elem)) {
    return;
  }

  // Grab the "toolbar" by finding "Close" button, which is _always_ present.
  // Note: do not use the aria-label values, it will break with i18n.
  const target = $('[aria-label]:last-child', elem).parentElement.nextSibling;
  if (!target || target.tagName.toLowerCase() !== 'div') {
    // Looks like the "create event" dialog, don't attempt to insert a button.
    return;
  }

  const getDescription = () => {
    const title = $('span[role="heading"]', elem);
    return title ? title.textContent.trim() : '';
  };

  const link = togglbutton.createTimerLink({
    className: 'google-calendar-modern',
    description: getDescription
  });
  target.prepend(link);
});
