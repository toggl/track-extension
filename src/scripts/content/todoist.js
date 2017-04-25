/*jslint indent: 2 plusplus: true*/
/*global $: false, togglbutton: false*/

'use strict';

function getProjectNameFromLabel(elem) {
  var projectLabel = '', projectLabelEle = $('.pname', elem.parentNode.parentNode);
  if (projectLabelEle) {
    projectLabel = projectLabelEle.textContent.trim();
  }
  return projectLabel;
}

var levelPattern = /(?:^|\s)indent_([0-9]*?)(?:\s|$)/;
function getParentEle(sidebarEle) {
  var curLevel, parentClass, parentCandidate;
  curLevel = sidebarEle.className.match(levelPattern)[1];
  parentClass = 'indent_' + (curLevel - 1);

  parentCandidate = sidebarEle;
  while (parentCandidate.previousElementSibling) {
    parentCandidate = parentCandidate.previousElementSibling;
    if (parentCandidate.classList.contains(parentClass)) {
      break;
    }
  }
  return parentCandidate;
}

function isTopLevelProject(sidebarEle) {
  return sidebarEle.classList.contains('indent_1');
}

function getProjectNameHierarchy(sidebarEle) {
  var parentProjectEle, projectName;
  projectName = $('.name', sidebarEle).firstChild.textContent.trim();
  if (isTopLevelProject(sidebarEle)) {
    return [projectName];
  }
  parentProjectEle = getParentEle(sidebarEle);
  return [projectName].concat(getProjectNameHierarchy(parentProjectEle));
}

function getSidebarEle(elem) {
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
}

function getProjectNames(elem) {
  var projectNames, viewingInbox, sidebarEle;
  viewingInbox = $('#filter_inbox.current, #filter_team_inbox.current');
  if (viewingInbox) {
    projectNames = ['Inbox'];
  } else {
    sidebarEle = getSidebarEle(elem);
    if (sidebarEle) {
      projectNames = getProjectNameHierarchy(sidebarEle);
    } else {
      projectNames = [getProjectNameFromLabel(elem)];
    }
  }
  return projectNames;
}

togglbutton.render('.task_item .content:not(.toggl)', {observe: true}, function (elem) {
  var link, descFunc, container = $('.text', elem);

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

  link = togglbutton.createTimerLink({
    className: 'todoist',
    description: descFunc(),
    projectName: getProjectNames(elem)
  });

  container.insertBefore(link, container.lastChild);
});
