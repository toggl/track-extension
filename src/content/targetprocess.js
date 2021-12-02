'use strict';

// main entity button
togglbutton.render('.view-header:not(.toggl)', { observe: true }, function (
  elem
) {
  const titleElement = $('.i-role-entity-title', elem);
  let entityIdElement = $('.entity-id.i-role-entity-id', elem);

  const projectFunc = function () {
    const projectItem = $('.tau-linkentity');
    return projectItem ? projectItem.textContent : '';
  };

  let entityIdName;

  // if element id not found with old tp version, try without the a cause it's just a span in new TP
  if (!entityIdElement) {
    entityIdElement = $('.entity-id', elem);
  }

  // if element id found continue
  if (entityIdElement) {
    entityIdName = entityIdElement.textContent + ' ' + titleElement.textContent;
    const link = togglbutton.createTimerLink({
      className: 'targetprocess',
      description: entityIdName,
      projectName: projectFunc
    });
    titleElement.parentElement.appendChild(link);
  }
});

// entity's task buttons
togglbutton.render(
  '.tau-list__table__row:not(.toggl)',
  { observe: true },
  function (elem) {
    const taskId = '#' + $('.tau-list__table__cell-id', elem).textContent.trim();
    const taskTitle = $('.tau-list__table__cell-name', elem).textContent.trim();

    const projectFunc = function () {
      const projectItem = $('.tau-linkentity');
      return projectItem ? projectItem.textContent : '';
    };

    const link = togglbutton.createTimerLink({
      className: 'targetprocess',
      description: taskId + ' ' + taskTitle,
      projectName: projectFunc,
      buttonType: 'minimal'
    });

    const buttonPlaceholder = $('.tau-list__table__cell-state', elem);
    buttonPlaceholder.insertBefore(link, buttonPlaceholder.firstChild);
  }
);

// tasks in table view
togglbutton.render('.tau-list-line:not(.toggl)', { observe: true }, function (
  elem
) {
  const taskIdElement = $('.tau-list-general_entity_id-cell', elem);
  const taskTitleElement = $('.tau-list-entity_name_1line-cell', elem);

  const projectFunc = function () {
    const projectItem = $('.tau-list-project_abbr-unit', elem);
    return projectItem ? projectItem.title : '';
  };

  let taskId;
  let taskTitle;

  // if element id found continue
  if (taskIdElement) {
    taskId =
      '#' + $('.tau-list-general_entity_id-cell', elem).textContent.trim();
    taskTitle = '';

    if (taskTitleElement) {
      taskTitle =
        ' ' + $('.tau-list-entity_name_1line-cell', elem).textContent.trim();
    }

    const link = togglbutton.createTimerLink({
      className: 'targetprocess',
      description: taskId + taskTitle,
      projectName: projectFunc,
      buttonType: 'minimal'
    });

    const buttonPlaceholder = $('.tau-board-unit_type_entity-name', elem);
    buttonPlaceholder.insertBefore(link, buttonPlaceholder.firstChild);
  }
});
