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

      const link = togglbutton.createTimerLink({
        className: `outlook`,
        description: () =>
          document.querySelector('div[role="heading"][title]')?.textContent
      });

      container.appendChild(link);
    }, 500);
  }
);

// Composing emails
togglbutton.render(
  '[role="menubar"] .ms-CommandBar-primaryCommand:not(.toggl)',
  { observe: true },
  (elem) => {
    const isComposingEmail = document.querySelector('div[data-testid="ComposeSendButton"]');

    if (isComposingEmail) {
      const subject = () =>
        document.querySelector('input.ms-TextField-field').value;

      const link = togglbutton.createTimerLink({
        className: "outlook",
        description: subject,
      });

      elem.appendChild(link);
    }
  }
);
