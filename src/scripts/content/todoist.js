/*jslint indent: 2 */
/*global $: false, togglbutton: false*/

'use strict';

togglbutton.render('.task_item .content:not(.toggl)', {observe: true}, function (elem) {
  var link, descFunc, container = $('.text', elem),
    projectElem = $('.project_link');

  descFunc = function () {
    var clone = container.cloneNode(true);

    while (clone.children.length) {
      clone.children[0].remove();
    }

    return clone.textContent.trim();
  };

  link = togglbutton.createTimerLink({
    className: 'todoist',
    description: descFunc,
    projectName: projectElem && projectElem.textContent
  });

  container.insertBefore(link, container.lastChild);
});
