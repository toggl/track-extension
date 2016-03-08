/*jslint indent: 2, unparam: true*/
/*global $: false, document: false, togglbutton: false*/
'use strict';

togglbutton.render('#section_title .panel_section_jump_links:not(.toggl)', {observe: true}, function (elem) {
  var link, description = $('#treeitem_panel_name').innerText,
    projectFunc = function () {
      var text = document.querySelector("#treeitem_panel_parent").innerText.split(">");
      return text[text.length - 1].trim();
    };

  link = togglbutton.createTimerLink({
    className: 'liquidplanner',
    description: description,
    projectName: projectFunc
  });

  elem.insertBefore(link, elem.firstChild);
});