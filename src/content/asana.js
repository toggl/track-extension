/**
 * @name Asana
 * @urlAlias app.asana.com 
 * @urlRegex *://app.asana.com/*
 */
'use strict';


// Board view. Inserts button next to assignee/due date.
togglbutton.render('.BoardCardLayout:not(.toggl)', { observe: true },
  boadCardElem => {
    if (boadCardElem.querySelector('.toggl-button')) {
      // Due to the way this UI is rendered, we must check for existence of old buttons manually.
      return;
    }

    const descriptionSelector = () => boadCardElem.querySelector('.BoardCard-taskName').textContent.trim();

    const link = togglbutton.createTimerLink({
      className: 'asana-board-view',
      description: descriptionSelector,
      buttonType: 'minimal',
      // N.B. Tags and ProjectName cannot be supported on board view as the information is not available.
    });

    const injectContainer = boadCardElem.querySelector('.BoardCardLayout-actionButtons');
    if (injectContainer) {
      injectContainer.insertAdjacentElement('afterbegin', link);
    }
  }
);

// Spreadsheet view. Inserts button next to to the task name.
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
      return projectHeader.textContent
        .replace(/\u00a0/g, ' ') // There can be &nbsp; in Asana header content
        .trim();
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

    const tagsSelector = () => {
      const tags = container.querySelectorAll('.SpreadsheetTaskRow-tagsCell .Pill');
      return [...tags].map(tag => tag.textContent.trim());
    };

    const link = togglbutton.createTimerLink({
      className: 'asana-spreadsheet',
      description: descriptionSelector,
      projectName: projectSelector,
      tags: tagsSelector,
      buttonType: 'minimal'
    });

    taskNameCell.insertAdjacentElement('afterend', link);
  }
);

// 2020 My Tasks view, possibly other similar views.
togglbutton.render('.MyTasksTaskRow:not(.toggl)', { observe: true },
  function (elem) {
    if (elem.querySelector('.toggl-button')) {
      // Due to the way this UI is rendered, we must check for existence of old buttons manually.
      return;
    }
    const descriptionSelector = () => elem.querySelector('.TaskName textarea').textContent;

    // attempt at separating projects and tags, which are not differentiated in the dom
    // assume first pill is a project and any others are tags
    // misses tags which are in the "..." overflow, and if there is a tag without a project
    const pillSelector = (type) => {
      const pills = [...elem.querySelectorAll('.Pill')]
        .map(pill => pill.textContent.trim());
      if (type === 'project') {
        return pills.length ? pills : '';
      } else if (type === 'tags') {
        return pills.length > 1 ? pills.slice(1) : [];
      }
    };

    const projectSelector = () => {
      return pillSelector('project');
    };

    const tagsSelector = () => {
      return pillSelector('tags');
    };

    const link = togglbutton.createTimerLink({
      className: 'asana-new-ui',
      description: descriptionSelector,
      projectName: projectSelector,
      tags: tagsSelector,
      buttonType: 'minimal'
    });

    const wrapper = document.createElement('div');
    wrapper.style.margin = '3px 0 0 4px';
    wrapper.appendChild(link);

    elem.appendChild(wrapper);
  }
);

// Task detail. My Tasks, Spreadsheet, Board, ...
togglbutton.render('.TaskPane:not(.toggl)', { observe: true },
  taskPaneEl => {
    if (taskPaneEl.querySelector('.toggl-button')) {
      // Due to the way this UI is rendered, we must check for existence of old buttons manually.
      return;
    }

    const descriptionSelector = () => taskPaneEl.querySelector('[aria-label="Task Name"]').textContent.trim();

    const projectSelector = () => {
      const projectElement = taskPaneEl.querySelector('.TokenizerPillBase-name');
      if (!projectElement) return '';

      return projectElement.textContent.trim();
    };

    const tagsSelector = () => {
      const tags = taskPaneEl.querySelectorAll('.TokenizerPillBase-name');
      return [...tags].map(tag => tag.textContent.trim());
    }

    const link = togglbutton.createTimerLink({
      className: 'TaskPaneToolbar-button',
      description: descriptionSelector,
      projectName: projectSelector,
      buttonType: 'minimal',
      tags: tagsSelector
    });

    const injectContainer = taskPaneEl.querySelector('.TaskPaneExtraActionsButton');

    if (injectContainer) {
      injectContainer.parentNode.insertBefore(link, injectContainer.nextSibling);
    }
  }
);
