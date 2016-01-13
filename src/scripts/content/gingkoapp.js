/*jslint indent: 2 */
/*global $: false, document: false, togglbutton: false*/
'use strict';

togglbutton.render('#navbar:not(.toggl)', {observe: true}, function (elem) {
  var link,
    description = document.querySelector(".navbar-tree-name"),
    project = '';

  var descFunc = function() {
    return description.textContent.trim();
  };

  link = togglbutton.createTimerLink({
    className: 'gingko-toggl-btn',
    description: descFunc,
    projectName: project,
    buttonType: "minimal"
  });

  link.style.margin="9px";

  $('.right-block').appendChild(link);
});
