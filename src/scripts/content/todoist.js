/*jslint indent: 2 plusplus: true*/
/*global $: false, togglbutton: false*/

'use strict';

togglbutton.render('.task_item .content:not(.toggl)', {observe: true}, function (elem) {
  var link, descFunc, projectFunc, container = $('.text', elem);

  descFunc = function () {
    var desc = container.textContent;
    return desc.substr(0, desc.length - 10).replace("  ", " ").trim();
  };

  projectFunc = function () {
    var projectElem, projectLabel;
    projectElem = $('.project_link');
    if (projectElem) {
      return projectElem.textContent.trim();
    }
    projectLabel = $('.pname', elem.parentNode.parentNode);
    if (projectLabel) {
      return projectLabel.textContent.trim();
    }
  };

  link = togglbutton.createTimerLink({
    className: 'todoist',
    description: descFunc,
    projectName: projectFunc
  });

  container.insertBefore(link, container.lastChild);
});
