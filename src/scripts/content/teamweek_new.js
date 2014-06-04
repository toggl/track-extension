/*jslint indent: 2 */
/*global $: false, document: false, togglbutton: false*/

'use strict';

togglbutton.render('.timeline-task-popup:not(.toggl)', {observe: true}, function (element) {
  var link,
    titleElement = $('input.title', element),
    projectNameElement = $('select[name=project_id]', element),
    container = $('footer.actions > .quick-actions', element);

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
      var projectSelectedElem = $('option:checked', projectNameElement);
      return projectSelectedElem.value ? projectSelectedElem.text : null;
    }
  });

  container.appendChild(link);
});
