/*jslint indent: 2 */
/*global $: false, document: false, togglbutton: false*/

'use strict';

togglbutton.render('.tb_task.expanded:not(.toggl)', {observe: true}, function (elem) {
  var link,
    container = $('.name_holder', elem),
    projectElem = $('.project a', elem),
    titleElem = $('.name', container);

  link = togglbutton.createTimerLink({
    className: 'redbooth',
    description: titleElem.textContent,
    projectName: projectElem && projectElem.textContent
  });

  container.appendChild(link);
});
