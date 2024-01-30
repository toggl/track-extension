/**
 * @name Notion Calendar
 * @urlAlias calendar.notion.so
 * @urlRegex *://calendar.notion.so/*
 */
'use strict';

togglbutton.render(
  'div[data-context-panel-root]:not(.toggl)',
  { observe: true },
  function (elem) {
    function getDescription () {
      const descriptionElem = elem.querySelector('div[contenteditable="true"]');
      return descriptionElem ? descriptionElem.textContent.trim() : '';
    }

    const link = togglbutton.createTimerLink({
      className: 'notion-calendar',
      description: getDescription
    });

    elem.firstChild.prepend(link);
  }
);
