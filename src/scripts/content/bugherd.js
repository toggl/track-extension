'use strict';

togglbutton.render('#detailBar > div:not(.toggl)', { observe: true }, function (
  elem
) {
  const container = $(
    '#detailBar > div > div.taskDetails.panelContent.flexHeight.flexScroller > div.taskDetailMain > div.taskDetailMeta'
  );

  const description = $(
    '#detailBar > div > div.taskDetails.panelContent.flexHeight.flexScroller > div.taskDetailMain > div.taskDetailMeta > span > span'
  );

  const project = $('#settingsBar > div.panelHead > div');

  const descFunc = function () {
    return description ? 'Task ' + description.textContent : '';
  };

  const projectFunc = function () {
    return project
      ? project.textContent
        .trim()
        .replace(/</g, '')
        .trim()
      : '';
  };

  const link = togglbutton.createTimerLink({
    className: 'bugherd',
    description: descFunc,
    projectName: projectFunc,
    buttonType: 'minimal'
  });

  container.appendChild(link);
});
