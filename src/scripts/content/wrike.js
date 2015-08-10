/*jslint indent: 2 */
/*global $: false, document: false, togglbutton: false*/
'use strict';

togglbutton.render('.wspace-task-view:not(.toggl)', {observe: true}, function () {
  var link,
    titleElem = function () {
      return $('title').innerText.replace(' - Wrike', '');
    };

  link = togglbutton.createTimerLink({
    className: 'wrike',
    description: titleElem
  });

  $('.wspace-task-settings-bar').appendChild(link);
});
