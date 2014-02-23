/*jslint indent: 2 */
/*global $: false, document: false, togglbutton: false*/

'use strict';

togglbutton.render('.task:not(.toggl)', {}, function (elem) {
  var link,
    projectElem = $('#client_name a'),
    taskElem = $('#tasks > .task > h1');

  if (taskElem === null || taskElem.firstChild === null) {
    return;
  }

  link = togglbutton.createTimerLink({
    className: 'worksection',
    description: taskElem.firstChild.textContent.trim(),
    projectName: projectElem && projectElem.innerText.trim()
  });
  link.classList.add('norm');

  $('#tmenu2', elem).appendChild(link);
});
