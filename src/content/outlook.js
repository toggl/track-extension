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

// Calendar event editor (create / edit an event). Anchor on the event command
// toolbar and re-add the button whenever it's missing (`:not(:has(.toggl-button))`)
// so it survives Outlook re-rendering the toolbar after the timer starts.
// The subject block (id carries `CalendarCompose` — stable, not localised, and
// unique to the event form) confirms we're in the event editor and supplies the
// title used as the timer description.
togglbutton.render(
  '[role="toolbar"][data-app-section="Toolbar"]:not(:has(.toggl-button))',
  { observe: true },
  (toolbar) => {
    // The toolbar must live inside an event modal. Without this guard a non-modal
    // Outlook toolbar would fall back to a document-wide lookup and could match a
    // CalendarCompose subject from a different editor — injecting a calendar
    // button (and the wrong event title) onto an unrelated toolbar.
    const dialog = toolbar.closest(".ms-Modal-scrollableContent");
    if (!dialog) {
      return;
    }

    // Scope the subject lookup to this modal; only the calendar event editor has
    // a CalendarCompose subject block.
    const subjectBlock = dialog.querySelector(
      '[id*="CalendarCompose"][id$="_SUBJECT"]'
    );
    if (!subjectBlock) {
      return;
    }

    const target = toolbar.querySelector(".fui-ToolbarGroup") || toolbar;
    if (target.querySelector(".toggl-button")) {
      return;
    }

    // Tag this specific modal (the subject id is unique per editor instance) so
    // the post-start popup portals into *this* editor, not the first modal on
    // the page when several editors are open.
    const popupHostId = subjectBlock.id;
    dialog.setAttribute("data-toggl-popup-host", popupHostId);

    function getDescription() {
      const titleInput = subjectBlock.querySelector("input");
      return titleInput ? titleInput.value.trim() : "";
    }

    const link = togglbutton.createTimerLink({
      className: "outlook-calendar",
      description: getDescription,
      // Portal the post-start edit popup into this event modal; on document.body
      // it renders behind Outlook's modal (z-index + focus trap) and is invisible.
      container: `[data-toggl-popup-host="${popupHostId}"]`,
    });

    target.appendChild(link);
  }
);

function getOpenedEmailSubject() {
  const emailSubjectElement = document.querySelector('div[role="heading"][title]');

  return emailSubjectElement ? emailSubjectElement.textContent.trim() : '';
}
