/*jslint indent: 2 */
/*global $: false, document: false, togglbutton: false*/
'use strict';
togglbutton.render('.task-list-section-collection-list li:not(.toggl)', {observe: true}, function (elem) {
  var link,
    container = $('.task-list-item-details', elem);

  if (container === null) {
    return;
  }

  // Have to remove the empty character projectName gets at the end
  link = togglbutton.createTimerLink({
    className: 'getflow',
    description: $('.content-list-item-name-wrapper', elem).textContent,
    projectName: $('.content-header-main-title .copy').textContent.slice(0, -1)
  });

  container.appendChild(link);
});