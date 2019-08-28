'use strict';

// List items
togglbutton.render(
  '.task-list-section-collection-list li:not(.toggl)',
  { observe: true },
  function (elem) {
    const container = $('.content-list-item-label', elem);
    const description = $('.content-list-item-name-wrapper', container).textContent;

    // Have to remove the empty character projectName gets at the end
    const link = togglbutton.createTimerLink({
      className: 'getflow',
      description: description,
      projectName: $('.task-list-section-header-link').textContent.trim()
    });

    container.appendChild(link);
  }
);

// Right side panel
togglbutton.render(
  '#app-pane .task-pane-name-field-textarea:not(.toggl)',
  { observe: true },
  function (elem) {
    const container = $('#app-pane .task-details-list');

    const descFunc = function () {
      return elem.value;
    };

    const projectFunc = function () {
      return $('#app-pane .task-pane-details-list-link').textContent.trim();
    };

    // Have to remove the empty character projectName gets at the end
    const link = togglbutton.createTimerLink({
      className: 'getflow',
      description: descFunc,
      projectName: projectFunc
    });

    container.appendChild(link);
  }
);
