/*jslint indent: 2 */
/*global $: false, document: false, togglbutton: false*/

'use strict';

// List items
togglbutton.render('.list li:not(.toggl)', {observe: true}, function (elem) {
  var link,
    taskElement = $('.task-title', elem),
    description = $('a', taskElement).textContent.trim(),
    projectName = function () {
      var label = $('span.highlight', taskElement);
      if (!!label) {
        return label.textContent;
      }
      return "";
    };

  link = togglbutton.createTimerLink({
    className: 'capsule',
    description: description,
    projectName: projectName,
    buttonType: 'minimal'
  });

  taskElement.appendChild(link);
});