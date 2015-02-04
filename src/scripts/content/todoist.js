/*jslint indent: 2 plusplus: true*/
/*global $: false, togglbutton: false*/

'use strict';

togglbutton.render('.task_item .content:not(.toggl)', {observe: true}, function (elem) {
  var link, descFunc, container = $('.text', elem),
    projectElem = $('.project_link');

  descFunc = function () {
    var clone = container.cloneNode(true),
      i = 0;

    while (clone.children.length > i) {
      if (clone.children[i].tagName === "B"
          || clone.children[i].tagName === "I") {
        i++;
      } else {
        clone.children[i].remove();
      }
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
