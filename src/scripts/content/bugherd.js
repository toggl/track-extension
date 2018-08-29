'use strict';

togglbutton.render('#detailBar > div:not(.toggl)', { observe: true }, function(
  elem
) {
  var link,
    descFunc,
    projectFunc,
    container = document.querySelector(
      '#detailBar > div > div.taskDetails.panelContent.flexHeight.flexScroller > div.taskDetailMain > div.taskDetailMeta'
    ),
    description = document.querySelector(
      '#detailBar > div > div.taskDetails.panelContent.flexHeight.flexScroller > div.taskDetailMain > div.taskDetailMeta > span > span'
    ),
    project = document.querySelector('#settingsBar > div.panelHead > div');

  descFunc = function() {
    return !!description ? 'Task ' + description.textContent : '';
  };

  projectFunc = function() {
    return !!project
      ? project.textContent
          .trim()
          .replace('<', '')
          .trim()
      : '';
  };

  var link = togglbutton.createTimerLink({
    className: 'bugherd',
    description: descFunc,
    projectName: projectFunc,
    buttonType: 'minimal'
  });

  container.appendChild(link);
});
