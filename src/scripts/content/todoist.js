/*jslint indent: 2 plusplus: true*/
/*global $: false, togglbutton: false*/

'use strict';

togglbutton.render('.task_item .content:not(.toggl)', {observe: true}, function (elem) {
  var link, descFunc, container = $('.text', elem),
    getSidebarEle, getProjectNameHierarchy, isTopLevelProject, levelPattern, getParentEle,
    getProjectNameFromLabel, getProjectNames;

  descFunc = function () {
    var clone = container.cloneNode(true),
      i = 0,
      child = null;

    while (clone.children.length > i) {
      child = clone.children[i];
      if (child.tagName === "B"
          || child.tagName === "I"
          || child.tagName === "STRONG"
          || child.tagName === "EM") {
        i++;
      } else if (child.tagName === "A") {
        if (child.classList.contains("ex_link")
            || child.getAttribute("href").indexOf("mailto:") === 0) {
          i++;
        } else {
          child.remove();
        }
      } else {
        child.remove();
      }
    }

    return clone.textContent.trim();
  };

  getSidebarEle = function (elem) {
    var editorInstance, projectId, sidebarRoot, sidebarColorEle, sidebarEle;
    editorInstance = elem.closest('.project_editor_instance');
    if (editorInstance) {
      projectId = editorInstance.getAttribute('data-project-id');
      sidebarRoot = $('#project_list');
      sidebarColorEle = $('#project_color_' + projectId, sidebarRoot);
      if (sidebarColorEle) {
        sidebarEle = sidebarColorEle.closest('.menu_clickable');
      }
    }
    return sidebarEle;
  };

  getProjectNameHierarchy = function(sidebarEle) {
    var parentProjectEle, projectName;
    projectName = $('.name', sidebarEle).firstChild.textContent.trim();
    if (isTopLevelProject(sidebarEle)) {
      return [projectName];
    } else {
      parentProjectEle = getParentEle(sidebarEle);
      return [projectName].concat(getProjectNameHierarchy(parentProjectEle));
    }
  };

  isTopLevelProject = function (sidebarEle) {
    return sidebarEle.classList.contains('indent_1');
  };

  levelPattern = /(?:^|\s)indent_(.*?)(?:\s|$)/;
  getParentEle = function(sidebarEle) {
    var curLevel, parentClass, parentCandidate;
    curLevel = sidebarEle.className.match(levelPattern)[1],
    parentClass = 'indent_' + (curLevel - 1);

    parentCandidate = sidebarEle;
    while (parentCandidate.previousElementSibling) {
      parentCandidate = parentCandidate.previousElementSibling;
      if (parentCandidate.classList.contains(parentClass)) {
        break;
      }
    }
   return parentCandidate;
  };

  getProjectNameFromLabel = function (elem) {
    var projectLabel='', projectLabelEle = $('.pname', elem.parentNode.parentNode);
    if (projectLabelEle) {
      projectLabel = projectLabelEle.textContent.trim();
    }
    return projectLabel;
  };

  getProjectNames = function() {
    var sidebarEle = getSidebarEle(elem);
    if (sidebarEle) {
      projectNames = getProjectNameHierarchy(sidebarEle);
    } else {
      projectNames = [getProjectNameFromLabel(elem)];
    }
    return projectNames;
  };

  link = togglbutton.createTimerLink({
    className: 'todoist',
    description: descFunc(),
    projectName: getProjectNames()
  });

  container.insertBefore(link, container.lastChild);
});
