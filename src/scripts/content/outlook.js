'use strict';

// Inbox emails
togglbutton.render('[aria-label="Content pane"] [role="heading"] span:not(.toggl)', { observe: true }, elem => {
  const container = elem.parentElement;

  const link = togglbutton.createTimerLink({
    className: 'outlook',
    description: elem.textContent
  });

  container.appendChild(link);
});

// Composing emails
togglbutton.render('[aria-label="Command toolbar"] .ms-CommandBar-primaryCommand:not(.toggl)', { observe: true }, elem => {
  const isComposingEmail = elem.querySelector('button[name="Send"]');

  if (isComposingEmail) {
    const subject = () => document.querySelector('[aria-label="Add a subject"]').value;

    const link = togglbutton.createTimerLink({
      className: 'outlook',
      description: subject
    });

    elem.appendChild(link);
  }
});
