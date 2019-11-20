'use strict';

// Spreadsheet view, 2019. Inserts button next to to the task name.
togglbutton.render('.SpreadsheetRow .SpreadsheetTaskName:not(.toggl)', { observe: true },
  function (taskNameCell) {
    const container = taskNameCell.closest('.SpreadsheetRow');

    if (container.querySelector('.toggl-button')) {
      // Due to the way this UI is rendered, we must check for existence of old buttons manually.
      return;
    }

    const descriptionSelector = () => taskNameCell.querySelector('textarea').textContent.trim();
    const projectHeaderSelector = () => {
      // Try to look for for page project title instead.
      const projectHeader = document.querySelector('.TopbarPageHeaderStructure.ProjectPageHeader .TopbarPageHeaderStructure-title');
      if (!projectHeader) {
        return '';
      }
      return projectHeader.textContent.trim();
    };
    const projectSelector = () => {
      const projectCell = container.querySelector('.SpreadsheetTaskRow-projectsCell');
      if (!projectCell) {
        // Try to look for for page project title instead.
        return projectHeaderSelector();
      }

      // There can be multiple projects, but we can't support trying to match multiple yet.
      const firstProject = projectCell.querySelector('.Pill');
      return firstProject ? firstProject.textContent.trim() : projectHeaderSelector();
    };

    const link = togglbutton.createTimerLink({
      className: 'asana-spreadsheet',
      description: descriptionSelector,
      projectName: projectSelector,
      buttonType: 'minimal'
    });

    taskNameCell.insertAdjacentElement('afterend', link);
  }
);

// 2019 My Tasks view, possibly other similar views.
togglbutton.render('.MyTasksTaskRow:not(.toggl)', { observe: true },
  function (elem) {
    if (elem.querySelector('.toggl-button')) {
      // Due to the way this UI is rendered, we must check for existence of old buttons manually.
      return;
    }
    const container = elem.querySelector('.ItemRowTwoColumnStructure-left');
    const description = elem.querySelector('.TaskName textarea').textContent;

    const projectSelector = () => {
      const projectElement = elem.querySelector('.TaskRow-pots .Pill');

      return projectElement ? projectElement.textContent : '';
    };

    const link = togglbutton.createTimerLink({
      className: 'asana-new-ui',
      description: description,
      projectName: projectSelector,
      buttonType: 'minimal'
    });

    container.appendChild(link);
  }
);

// Old and Beta UI - detail view
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
