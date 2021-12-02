'use strict';
/* global togglbutton, $ */

togglbutton.render(
  '.ErrorShowHeadline:not(.toggl)',
  { observe: true },
  el => {
    const link = togglbutton.createTimerLink({
      className: 'bugsnag',
      description: descriptionSelector
    });

    $('.ErrorShowHeadline-errorClassContext .ExpandableLine-content', el).appendChild(link);
  }
);

const descriptionSelector = el =>
  ['.EventText-errorClass', '.EventText-errorLocation'].map(s => $(s, el).textContent.trim()).join(' ');
