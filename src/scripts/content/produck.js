/* global $, togglbutton */
'use strict';

// Issue details view
togglbutton.render(
  '[data-toggl-issue] [data-toggl-sidebar]:not(.toggl)',
  { observe: true },
  elem => {
    const getAlias = function () {
      const aliasSelector = $('[data-toggl-issue] [data-toggl-alias]');
      if (!aliasSelector) return 'No Alias';
      return aliasSelector.getAttribute('data-toggl-alias');
    };

    const getTitle = function () {
      const titleSelector = $('[data-toggl-issue] [data-toggl-title]');
      if (!titleSelector) return 'No Title';
      return titleSelector.getAttribute('data-toggl-title') || 'No Title';
    };

    const getDescription = function () {
      return getAlias() + ' - ' + getTitle();
    };

    const getProjectName = function () {
      const projectSelector = $('[data-toggl-issue] [data-toggl-project]');
      if (!projectSelector) return null;
      return projectSelector.getAttribute('data-toggl-project');
    };

    const link = togglbutton.createTimerLink({
      className: 'produck',
      description: getDescription,
      projectName: getProjectName
    });
    const li = document.createElement('li');
    li.classList.add('toggl-item');
    li.appendChild(link);
    elem.prepend(li);
  }
);
