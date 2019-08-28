'use strict';

togglbutton.render(
  '#treeitem_panel .details.page:not(.toggl)',
  { observe: true },
  function (elem) {
    const description = $('#treeitem_panel_name').textContent;

    const projectFunc = function () {
      const text = $('#treeitem_panel_parent').textContent.split('>');
      return text[text.length - 1].trim();
    };

    const link = togglbutton.createTimerLink({
      className: 'liquidplanner',
      description: description,
      projectName: projectFunc
    });

    elem.insertBefore(link, elem.firstChild);
  }
);
