/*jslint indent: 2 */
/*global $: false, document: false, togglbutton: false*/

'use strict';

togglbutton.render('.task:not(.toggl)', {observe: true}, function (elem) {
  var link,
    projectElem = $('#client_name b'),
    taskElem = $('.task h1');

  if (!taskElem) {
    return;
  }

  taskElem = taskElem.childNodes[2].textContent.trim();

  link = togglbutton.createTimerLink({
    className: 'worksection',
    description: taskElem,
    projectName: projectElem && projectElem.textContent.trim()
  });
  link.classList.add('norm');

  $('#tmenu2', elem).appendChild(link);
});
