'use strict';
/* global togglbutton, $ */

const todoistEditor = document.getElementById('content');

togglbutton.render(
  '.task_item .task_item_actions:not(.toggl)',
  { observe: true, observeTarget: todoistEditor, debounceInterval: 100 },
  elem => {
    const content = elem.closest('.task_item').querySelector('.content');
    const text = content.querySelector('.text');

    const descriptionSelector = () => text.querySelector('.task_item_content_text').textContent;

    const tagsSelector = () => {
      const tags = content.querySelectorAll('.labels_holder a:not(.label_sep)');

      return [...tags].map(tag => {
        return tag.textContent;
      });
    };

    const link = togglbutton.createTimerLink({
      className: 'todoist',
      description: descriptionSelector,
      projectName: getProjectNames(content),
      buttonType: 'minimal',
      tags: tagsSelector
    });

    const wrapper = document.createElement('div');
    wrapper.classList.add('task_info', 'task_content_item');
    wrapper.style.display = 'flex';
    wrapper.style.alignItems = 'center';
    wrapper.style.justifyContent = 'center';
    wrapper.appendChild(link);

    elem.insertBefore(wrapper, elem.firstChild);
  }
);

/*
Projects may have a hierarchy in Todoist.

The selector functions for project name take this into account.
All project names found in the hierarchy will be passed to Toggl button,
which will figure out what the lowest level existing project is.

E.g.
- Project hierarchy is MyProject > MySubProject > MyFeatureProject
- Selector will find all three project names and pass to Toggl Button
- Toggl Button will first check if MyFeatureProject exists, and if it doesn't, try to use the next parent etc.
*/

function getProjectNameFromLabel (elem) {
  let projectLabel = '';
  const projectLabelEle = $('.project_item__name', elem.parentNode.parentNode);
  if (projectLabelEle) {
    projectLabel = projectLabelEle.textContent.trim();
  }
  return projectLabel;
}

function getParentEle (sidebarCurrentEle) {
  const levelPattern = /(?:^|\s)indent_(\d*?)(?:\s|$)/;
  const curLevel = sidebarCurrentEle.className.match(levelPattern)[1];
  const parentClass = 'indent_' + (curLevel - 1);
  let parentCandidate = sidebarCurrentEle;

  while (parentCandidate.previousElementSibling) {
    parentCandidate = parentCandidate.previousElementSibling;
    if (parentCandidate.classList.contains(parentClass)) {
      break;
    }
  }
  return parentCandidate;
}

function isTopLevelProject (sidebarCurrentEle) {
  return sidebarCurrentEle.classList.contains('indent_1');
}

function getProjectNameHierarchy (sidebarCurrentEle) {
  const projectName = $(
    '.name',
    sidebarCurrentEle
  ).firstChild.textContent.trim();

  if (isTopLevelProject(sidebarCurrentEle)) {
    return [projectName];
  }

  const parentProjectEle = getParentEle(sidebarCurrentEle);
  return [projectName].concat(getProjectNameHierarchy(parentProjectEle));
}

function projectWasJustCreated (projectId) {
  return projectId.startsWith('_');
}

function getSidebarCurrentEle (elem) {
  let projectId;
  let sidebarRoot;
  let sidebarColorEle;
  let sidebarCurrentEle;
  const editorInstance = elem.closest('.project_editor_instance');

  if (editorInstance) {
    projectId = editorInstance.getAttribute('data-project-id');
    sidebarRoot = $('#project_list');
    if (projectWasJustCreated(projectId)) {
      sidebarCurrentEle = $('.current', sidebarRoot);
    } else {
      sidebarColorEle = $('#project_color_' + projectId, sidebarRoot);
      if (sidebarColorEle) {
        sidebarCurrentEle = sidebarColorEle.closest('.menu_clickable');
      }
    }
  }
  return sidebarCurrentEle;
}

function getProjectNames (elem) {
  // Return a function for timer link to use, in order for projects to be retrieved
  // at the moment the button is clicked (rather than only on load)
  return () => {
    let projectNames;
    let sidebarCurrentEle;

    const isViewingInbox = $(
      '#filter_inbox.current, #filter_team_inbox.current'
    );

    if (isViewingInbox) {
      projectNames = ['Inbox'];
    } else {
      sidebarCurrentEle = getSidebarCurrentEle(elem);
      if (sidebarCurrentEle) {
        projectNames = getProjectNameHierarchy(sidebarCurrentEle);
      } else {
        projectNames = [getProjectNameFromLabel(elem)];
      }
    }
    return projectNames;
  };
}
