/*jslint indent: 2 */
/*global $: false, togglbutton: false, createTag:false*/

'use strict';

togglbutton.render('.dialog:not(.toggl)', {observe: true}, function (elem) {
  var link, wrap = createTag('div'),
    container = $('#top-level-details', elem),
    titleElem = $('#title', elem),
    projectElem = $('.folderSelector', elem);

  link = togglbutton.createTimerLink({
    className: 'anydo',
    description: titleElem.value,
    projectName: projectElem.textContent
  });

  wrap.appendChild(link);
  container.appendChild(wrap);
});
