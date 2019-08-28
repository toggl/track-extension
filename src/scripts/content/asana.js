'use strict';

// New UI Board view v1 and v2
togglbutton.render(
  '.BoardColumnCardsContainer-item:not(.toggl)',
  { observe: true },
  function (elem) {
    if ($('.toggl-button', elem)) {
      return;
    }
    const container = $('.BoardCardWithCustomProperties-assigneeAndDueDate', elem);
    const description = $('.BoardCardWithCustomProperties-name', elem).textContent;
    const project = $('.SidebarItemRow.is-selected').textContent;

    const link = togglbutton.createTimerLink({
      className: 'asana-board',
      description: description,
      projectName: project,
      buttonType: 'minimal'
    });

    container.appendChild(link);
  }
);

// New UI Board task detail view v2
togglbutton.render(
  '.SingleTaskPane-titleRow:not(.toggl)',
  { observe: true },
  function (elem) {
    if ($('.toggl-button', elem)) {
      return;
    }
    const container = $('.SingleTaskPaneToolbar');

    const descriptionSelector = () => {
      return $(
        '.SingleTaskPane-titleRow .simpleTextarea',
        elem.parentNode
      ).textContent;
    };

    const projectSelector = () => {
      const projectElement = $(
        '.SingleTaskPane-projects .TaskProjectPill-projectName',
        elem.parentNode
      );

      return projectElement ? projectElement.textContent : '';
    };

    const link = togglbutton.createTimerLink({
      className: 'asana-board',
      description: descriptionSelector,
      projectName: projectSelector,
      buttonType: 'minimal'
    });

    link.style.marginRight = '5px';

    if (container) {
      const closeButton = container.lastElementChild;
      container.insertBefore(link, closeButton);
    }
  }
);
