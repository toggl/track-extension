'use strict';

// Older UI
togglbutton.render(
  '.details-pane-body:not(.toggl)',
  { observe: true },
  function (elem) {
    const container = $('.sticky-view-placeholder', elem);
    const description = $('#details_property_sheet_title', elem);
    const project = $('#details_pane_project_tokenizer .token_name', elem);

    const descFunc = function () {
      return description ? description.value : '';
    };

    const projectFunc = function () {
      return (
        (project && project.textContent) ||
        ($('.ancestor-projects', elem) &&
          $('.ancestor-projects', elem).textContent) ||
        ''
      );
    };

    const link = togglbutton.createTimerLink({
      className: 'asana',
      description: descFunc,
      projectName: projectFunc
    });

    container.parentNode.insertBefore(link, container.nextSibling);
  }
);

// New UI v1
togglbutton.render(
  '#right_pane__contents .SingleTaskPane:not(.toggl)',
  { observe: true },
  function (elem) {
    const container = $('.SingleTaskTitleRow', elem);
    const description = $('.SingleTaskTitleRow .simpleTextarea', elem);
    const project = $('.TaskProjectPill-projectName div', elem);

    if (!container) {
      return;
    }

    const descFunc = function () {
      return description ? description.value : '';
    };

    const projectFunc = function () {
      return (
        (project && project.textContent) ||
        ($('.TaskAncestry-ancestorProjects', elem) &&
          $('.TaskAncestry-ancestorProjects', elem).textContent) ||
        ''
      );
    };

    const link = togglbutton.createTimerLink({
      className: 'asana-new',
      description: descFunc,
      projectName: projectFunc
    });

    container.after(link);
  }
);

// New UI v2
togglbutton.render(
  '#right_pane__contents .SingleTaskPane-body:not(.toggl)',
  { observe: true },
  function (elem) {
    const container = $('.TaskPaneAssigneeDueDateRowStructure', elem);
    const description = $('.SingleTaskPane-titleRow .simpleTextarea', elem);
    const project = $('.TaskProjectPill-projectName div', elem);

    const descFunc = function () {
      return description ? description.value : '';
    };

    const projectFunc = function () {
      return (
        (project && project.textContent) ||
        ($('.TaskAncestry-ancestorProjects', elem) &&
          $('.TaskAncestry-ancestorProjects', elem).textContent) ||
        ''
      );
    };

    const link = togglbutton.createTimerLink({
      className: 'asana-new',
      description: descFunc,
      projectName: projectFunc
    });

    container.appendChild(link);
  }
);

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

// New UI Board task detail view v1
togglbutton.render(
  '.SingleTaskTitleRow:not(.toggl)',
  { observe: true },
  function (elem) {
    if ($('.toggl-button', elem)) {
      return;
    }
    const container = $('.SingleTaskPaneToolbar', elem.parentNode);
    const description = $('.SingleTaskTitleRow textarea', elem.parentNode).textContent;
    const projectElement = $(
      '.SingleTaskPane-projects .TaskProjectPill-projectName',
      elem.parentNode
    );

    const link = togglbutton.createTimerLink({
      className: 'asana-board',
      description: description,
      projectName: projectElement ? projectElement.textContent : '',
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

    const description = function () {
      return $(
        '.SingleTaskPane-titleRow .simpleTextarea',
        elem.parentNode
      ).textContent;
    };

    const projectElement = $(
      '.SingleTaskPane-projects .TaskProjectPill-projectName',
      elem.parentNode
    );

    const link = togglbutton.createTimerLink({
      className: 'asana-board',
      description: description,
      projectName: projectElement ? projectElement.textContent : '',
      buttonType: 'minimal'
    });

    link.style.marginRight = '5px';

    if (container) {
      const closeButton = container.lastElementChild;
      container.insertBefore(link, closeButton);
    }
  }
);
