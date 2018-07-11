/*jslint indent: 2 */
/*global $: false, document: false, togglbutton: false*/

togglbutton.render('.tree-row:not(.toggl)', {observe: true}, function (elem) {
  'use strict';
  var link, description = $('.task-name', elem).textContent;

  link = togglbutton.createTimerLink({
    className: 'quire',
    description: description,
    buttonType: 'minimal'
  });

  if ($(".task-input", elem)) {
    $(".task-input", elem).addEventListener("DOMNodeRemoved", function () {
      elem.classList.remove('toggl');
    });
  }

  $(".tree-row-front", elem).appendChild(link);
});
