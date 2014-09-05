/*jslint indent: 2 */
/*global $: false, togglbutton: false, createTag:false*/

'use strict';

togglbutton.render('.task-details:not(.toggl)', {observe: true}, function (elem) {
  var link, wrap = createTag('div'),
    container = $('.top-level-details', elem),
    titleElem = $('#quickTitle', elem),
    projectElem = $('.folderSelector', elem);

  link = togglbutton.createTimerLink({
    className: 'anydo',
    description: titleElem.textContent,
    projectName: projectElem.textContent
  });

  wrap.appendChild(link);
  container.appendChild(wrap);
});
