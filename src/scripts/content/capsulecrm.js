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


// List items in new UI
togglbutton.render('.task-item:not(.toggl)', {observe: true}, function (elem) {
  var link,
    taskElement = $('.task-item-title', elem),
    description = function () {
      var desc = $('.task-item-title-text', elem);
      if (!!desc) {
        return desc.textContent.trim();
      }
      return "";
    },
    projectName = function () {
      var label = $('span.task-item-category', elem);
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