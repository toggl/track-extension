/*jslint indent: 2, unparam: true*/
/*global $: false, document: false, togglbutton: false*/
'use strict';

document.getElementById('projects_split_view').addEventListener("DOMSubtreeModified", function() {
  togglbutton.render('#section_title .panel_section_jump_links:not(.toggl)', {}, function (elem) {
    console.log("render starts");
    var link, description;
    description = $('#treeitem_panel_name').innerText;

    link = togglbutton.createTimerLink({
      className: 'liquidplanner',
      description: description
    });

    elem.insertBefore(link, elem.firstChild);
  });
});
