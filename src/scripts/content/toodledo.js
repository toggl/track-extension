/*jslint indent: 2 */
/*global $: false, document: false, togglbutton: false*/

'use strict';

togglbutton.render('.row:not(.toggl)', {observe: true}, function (elem) {
  var link,
    taskElem = $('.col0', elem),
    goalElem = $('.col1024', elem);

  link = togglbutton.createTimerLink({
    className: 'toodledo',
    description: taskElem.firstChild.textContent,
    projectName: goalElem && goalElem.textContent
  });

  taskElem.appendChild(link);
});
