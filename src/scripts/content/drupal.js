'use strict';

togglbutton.render(
  'body.node-type-project-issue #tabs ul:not(.toggl)',
  {},
  function (elem) {
    const link = togglbutton.createTimerLink({
      className: 'drupalorg',
      description: elem.textContent
    });

    elem.appendChild(document.createElement('li').appendChild(link));
  }
);
