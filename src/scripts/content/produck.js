/*jslint indent: 2 */
/*global $: false, document: false, togglbutton: false*/
'use strict';

// Issue details view
togglbutton.render('[data-toggl-issue] [data-toggl-sidebar]:not(.toggl)', {observe: true}, function (elem) {
  var li, link, getDescription, getProjectName, getAlias, getTitle;

  getAlias = function() {
    var aliasSelector = $('[data-toggl-issue] [data-toggl-alias]');
    if(!aliasSelector) return 'No Alias';
    return aliasSelector.getAttribute('data-toggl-alias');
  }

  getTitle = function() {
    var titleSelector = $('[data-toggl-issue] [data-toggl-title]');
    if(!titleSelector) return 'No Title';
    return titleSelector.getAttribute('data-toggl-title') || 'No Title';
  }

  getDescription = function() {
    return getAlias() + " - " + getTitle();
  }

  getProjectName = function() {
    var projectSelector = $('[data-toggl-issue] [data-toggl-project]');
    if(!projectSelector) return null;
    return projectSelector.getAttribute('data-toggl-project');
  }

    link = togglbutton.createTimerLink({className: 'produck', description: getDescription, projectName: getProjectName});
    li = document.createElement("li");
    li.classList.add("toggl-item");
    li.appendChild(link);
    elem.prepend(li);
});
