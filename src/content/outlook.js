/**
 * @name Outlook
 * @urlAlias outlook.office.com
 * @urlRegex *://outlook.office.com/*
 */
 
"use strict";

// Inbox emails
togglbutton.render(
  '[aria-label="Message actions"]:not(.toggl)',
  { observe: true },
  (elem) => {
    const link = togglbutton.createTimerLink({
      className: "outlook",
      description: () => document.querySelector('div[role="heading"]').textContent
    });

    elem.childNodes[0].appendChild(link);
  }
);

// Composing emails
togglbutton.render(
  '[aria-label="Command toolbar"] .ms-CommandBar-primaryCommand:not(.toggl)',
  { observe: true },
  (elem) => {
    const isComposingEmail = elem.querySelector('button[name="Send"]');

    if (isComposingEmail) {
      const subject = () =>
        document.querySelector('[aria-label="Add a subject"]').value;

      const link = togglbutton.createTimerLink({
        className: "outlook",
        description: subject,
      });

      elem.appendChild(link);
    }
  }
);
