/*jslint indent: 2 */
/*global $: false, togglbutton: false*/

(function () {
  'use strict';

  togglbutton.render('li.task.daily:not(.toggl), li.task.habit:not(.toggl), li.task.todo:not(.toggl)',
                     {observe: true}, function (elem) {
      var link,
        text = $('.task-text>markdown', elem).innerText.trim(),
        container = $('.task-meta-controls', elem);

      link = togglbutton.createTimerLink({
        className: 'habitica',
        description: text,
        buttonType: 'minimal'
      });

      container.appendChild(link);
    });
}());
