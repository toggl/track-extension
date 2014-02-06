/*jslint indent: 2 */
/*global $: false, document: false, togglbutton: false*/

'use strict';

togglbutton.render('.timeline-task-popup:not(.toggl)', {observe: true}, function (elem) {
  var link,
    titleElem = $('input.title', elem),
    projectNameElem = $('select[name=project_id]', elem),
    container = $('footer.actions .cancel', elem);

  if (titleElem === null || container === null) {
    return;
  }

  link = togglbutton.createTimerLink({
    className: 'teamweek-new',
    description: function () {
      return titleElem.value;
    },
    projectName: function () {
      var projectSelectedElem = $('option:checked', projectNameElem);
      return projectSelectedElem.value ? projectSelectedElem.text : null;
    }
  });

  container.parentNode.appendChild(link);
});
