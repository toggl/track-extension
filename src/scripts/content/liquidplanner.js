'use strict';

togglbutton.render(
  '#treeitem_panel .details.page:not(.toggl)',
  { observe: true },
  function(elem) {
    var link,
      description = $('#treeitem_panel_name').textContent,
      projectFunc = function() {
        var text = $('#treeitem_panel_parent').textContent.split('>');
        return text[text.length - 1].trim();
      };

    link = togglbutton.createTimerLink({
      className: 'liquidplanner',
      description: description,
      projectName: projectFunc
    });

    elem.insertBefore(link, elem.firstChild);
  }
);
