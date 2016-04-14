/*jslint indent: 2 */
/*global $: false, document: false, togglbutton: false*/
'use strict';

togglbutton.render('.editor__header:not(.toggl)', {observe: true}, function (elem) {
  var link,
    tabs = $('.editor__switch-mode', elem),
    description = function () {
      return document.querySelector(".editor-title__input").value;
    };

  if (!!$('.toggl-button')) {
    return;
  }

  link = togglbutton.createTimerLink({
    className: 'wordpress',
    description: description
  });

  tabs.parentElement.insertBefore(link, tabs);
});