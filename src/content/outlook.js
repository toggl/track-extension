/**
 * @name Outlook
 * @urlAlias outlook.office.com
 * @urlRegex *://outlook.office.com/*
 */

"use strict";

// Inbox emails
togglbutton.render(
  'div[role="tabpanel"]:not(.toggl)',
  { observe: true },
  (elem) => {
    setTimeout(() => {
      const container = document.querySelectorAll(
        'div[role="tabpanel"] div[role="group"]'
      )[1];

      // If the container is not found or the button is already there, do nothing
      if (!container || container.querySelector('.toggl-button')) {
        return;
      }

      const link = togglbutton.createTimerLink({
        className: "outlook-panel",
        description: getOpenedEmailSubject,
      });

      container.appendChild(link);
    }, 500);
  }
);

// Composing emails
togglbutton.render(
  '#ReadingPaneContainerId div[data-testid="ComposeSendButton"]:not(.toggl)',
  { observe: true },
  (elem) => {
    const composeSendButton = $('div[data-testid="ComposeSendButton"]');

    if (!composeSendButton) {
      return;
    }

    function getDescription() {
      // If making a reply, the subject is already filled
      const emailSubject = getOpenedEmailSubject();
      if (emailSubject) {
        return emailSubject;
      }

      // If composing a new email or making a forward
      return document.querySelector('input.ms-TextField-field').value;
    }

    const link = togglbutton.createTimerLink({
      className: "outlook",
      description: getDescription,
    });

    composeSendButton.after(link);
  }
);

function getOpenedEmailSubject() {
  const emailSubjectElement = document.querySelector('div[role="heading"][title]');

  return emailSubjectElement ? emailSubjectElement.textContent.trim() : '';
}
