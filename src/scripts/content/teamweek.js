/*jslint indent: 2 */
/*global $: false, document: false, togglbutton: false*/

'use strict';

togglbutton.render('.timeline-task-popup:not(.toggl)', {observe: true}, function (element) {
  var link,
    titleElement = $('[data-hook=input-name]', element),
    projectNameElement = element,
    container = $('[data-hook=row-actions]', element);

  if (titleElement === null || container === null) {
    return;
  }

  link = togglbutton.createTimerLink({
    className: 'teamweek-new',
    buttonType: 'minimal',
    description: function () {
      return titleElement.value;
    },
    projectName: function () {
      var projectSelectedElem = $('[data-hook=input-project]', projectNameElement);
      return projectSelectedElem.value || null;
    }
  });

  container.appendChild(link);
});
