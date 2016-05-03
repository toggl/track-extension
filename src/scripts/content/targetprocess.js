/*jslint indent: 2 */
/*global $: false, document: false, togglbutton: false*/
'use strict';

// main entity button
togglbutton.render('div.general-info:not(.toggl)', {observe: true}, function (elem) {
  var link,
    titleElement = $('.i-role-title', elem),
    entityIdName = $('.entity-id a', elem).textContent + ' ' + titleElement.textContent,
    projectFunc = function () {
      var projectItem =  $('.tau-linkentity');
      return projectItem ? projectItem.textContent : "";
    };

  link = togglbutton.createTimerLink({
    className:   'targetprocess',
    description: entityIdName,
    projectName: projectFunc
  });

  titleElement.parentElement.appendChild(link);
});

// entity's task buttons
togglbutton.render('.tau-list__table__row:not(.toggl)', {observe: true}, function (elem) {
  var link,
    buttonPlaceholder,
    taskId      = '#' + $('.tau-list__table__cell-id', elem).textContent.trim(),
    taskTitle   = $('.tau-list__table__cell-name', elem).textContent.trim(),
    projectFunc = function () {
      var projectItem =  $('.tau-linkentity');
      return projectItem ? projectItem.textContent : "";
    };

  link = togglbutton.createTimerLink({
    className:   'targetprocess',
    description: taskId + ' ' + taskTitle,
    projectName: projectFunc,
    buttonType:  'minimal'
  });

  buttonPlaceholder = $('.tau-list__table__cell-state', elem);
  buttonPlaceholder.insertBefore(link, buttonPlaceholder.firstChild);
});

