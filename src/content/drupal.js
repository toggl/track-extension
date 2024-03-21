'use strict';

togglbutton.render(
  'body.node-type-project-issue #tabs ul:not(.toggl)',
  {},
  function (elem) {
    const getDescription = () => {
      const descriptionElem = document.getElementById('page-subtitle');
      return descriptionElem ? descriptionElem.textContent.trim() : '';
    };

    const link = togglbutton.createTimerLink({
      className: 'drupalorg',
      description: getDescription
    });

    elem.appendChild(document.createElement('li').appendChild(link));
  }
);
