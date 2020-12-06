'use strict';

// Board view. Inserts button next to assignee/due date.
togglbutton.render('.BoardCard .BoardCard-contents:not(.toggl)', { observe: true },
  boadCardElem => {
    const descriptionSelector = () => $('.BoardCard-name', boadCardElem).textContent.trim();

    const projectSelector = () => {
      const projectElement = $('.TopbarPageHeaderStructure-titleRow > h1');
      if (!projectElement) return '';

      return projectElement.textContent.trim();
    };

    const link = togglbutton.createTimerLink({
      className: 'asana-board-view',
      description: descriptionSelector,
      projectName: projectSelector,
      buttonType: 'minimal'
      // N.B. tags cannot be supported on board view as the information is not available.
    });

    const injectContainer = $('.BoardCard-rightMetadata', boadCardElem);
    if (injectContainer) {
      injectContainer.insertAdjacentElement('afterbegin', link);
    }
  }
);

// Spreadsheet view. Inserts button next to to the task name.
togglbutton.render('.SpreadsheetRow .SpreadsheetTaskName:not(.toggl)', { observe: true },
  function (taskNameCell) {
    const container = taskNameCell.closest('.SpreadsheetRow');

    if ($('.toggl-button', container)) {
      // Due to the way this UI is rendered, we must check for existence of old buttons manually.
      return;
    }

    const descriptionSelector = () => $('textarea', taskNameCell).textContent.trim();
    const projectHeaderSelector = () => {
      // Try to look for for page project title instead.
      const projectHeader = $('.TopbarPageHeaderStructure.ProjectPageHeader .TopbarPageHeaderStructure-title');
      if (!projectHeader) {
        return '';
      }
      return projectHeader.textContent
        .replace(/\u00a0/g, ' ') // There can be &nbsp; in Asana header content
        .trim();
    };
    const projectSelector = () => {
      const projectCell = $('.SpreadsheetTaskRow-projectsCell', container);
      if (!projectCell) {
        // Try to look for for page project title instead.
        return projectHeaderSelector();
      }

      // There can be multiple projects, but we can't support trying to match multiple yet.
      const firstProject = $('.Pill', projectCell);
      return firstProject ? firstProject.textContent.trim() : projectHeaderSelector();
    };

    const tagsSelector = () => {
      const tags = $$('.SpreadsheetTaskRow-tagsCell .Pill', container);
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
    if ($('.toggl-button', elem)) {
      // Due to the way this UI is rendered, we must check for existence of old buttons manually.
      return;
    }
    const descriptionSelector = () => $('.TaskName textarea', elem).textContent;

    // attempt at separating projects and tags, which are not differentiated in the dom
    // assume first pill is a project and any others are tags
    // misses tags which are in the "..." overflow, and if there is a tag without a project
    const pillSelector = (type) => {
      const pills = [...$$('.Pill'), elem]
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
togglbutton.render(
  '.SingleTaskPaneSpreadsheet:not(.toggl)',
  { observe: true },
  function (elem) {
    if ($('.toggl-button', elem)) {
      return;
    }

    const descriptionSelector = () => {
      return $('.SingleTaskTitleInput-taskName textarea', elem).textContent.trim();
    };

    const projectSelector = () => {
      const projectEl = $$('.TaskProjectToken-potTokenizerPill', elem);
      return [...projectEl].map(el => el.textContent.trim());
    };

    const tagsSelector = () => {
      const tags = $$('.TaskTagTokenPills .Pill', elem);
      return [...tags].map(tag => tag.textContent.trim());
    };

    const link = togglbutton.createTimerLink({
      className: 'asana-board',
      description: descriptionSelector,
      projectName: projectSelector,
      tags: tagsSelector,
      buttonType: 'minimal'
    });

    link.style.margin = '0 5px';

    const firstButton = $('.SingleTaskPaneToolbar-button', elem);
    firstButton.parentNode.insertBefore(link, firstButton);
  }
);
