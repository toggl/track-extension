/*jslint indent: 2 */
/*global $: false, document: false, togglbutton: false*/
'use strict';

togglbutton.render('.editor__header:not(.toggl)', {observe: true}, function (elem) {
  var link,
    description = function () {
      return document.querySelector(".editor-title__input").value;
    },
	tabs = $('.editor__switch-mode', elem);

  link = togglbutton.createTimerLink({
    className: 'wordpress',
    description: description
  });
  
  tabs.parentElement.insertBefore(link, tabs);
});