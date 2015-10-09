/*jslint indent: 2 */
/*global $: false, document: false, togglbutton: false*/
'use strict';

togglbutton.render('.wspace-task-view:not(.toggl)', {observe: true}, function (elem) {
  var link,
    container = $('.wrike-panel-header-toolbar', elem),
    titleElem = function () {
      return $('title').innerText.replace(' - Wrike', '');
    };

  link = togglbutton.createTimerLink({
    className: 'wrike',
    description: titleElem
  });

  container.insertBefore(link, container.firstChild);
});
