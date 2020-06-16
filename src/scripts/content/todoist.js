'use strict';
/* global togglbutton, $ */

const todoistEditor = document.getElementById('content');

// main list view
togglbutton.render(
  '.task_item .task_item_actions:not(.toggl)',
  { observe: true, observeTarget: todoistEditor, debounceInterval: 100 },
  elem => {
    const content = elem.closest('.task_item').querySelector('.content');
    const text = content.querySelector('.text');

    const descriptionSelector = () => text.querySelector('.task_item_content_text').textContent;

    const tagsSelector = () => {
      const tags = content.querySelectorAll('a.label');

      return [...tags].map(tag => tag.textContent);
    };

    const link = togglbutton.createTimerLink({
      className: 'todoist',
      description: descriptionSelector,
      projectName: getProjectNames(content),
      buttonType: 'minimal',
      tags: tagsSelector
    });

    const wrapper = document.createElement('div');
    wrapper.classList.add('task_content_item');
    wrapper.style.display = 'flex';
    wrapper.style.alignItems = 'center';
    wrapper.style.justifyContent = 'center';
    wrapper.appendChild(link);

    elem.insertBefore(wrapper, elem.firstChild);
  }
);

// task view
// First example of data-attribute integration ✨
togglbutton.render('[data-item-detail-root] [data-item-actions-root]:not(.toggl)', { observe: true }, elem => {
  const description = () => elem.dataset.itemContent || '';
  const project = () => elem.dataset.itemProjectName || '';
  const tags = () => Array.from(elem.querySelectorAll('[data-item-label-name]'))
    .map(el => el.dataset.itemLabelName)
    .filter(Boolean);

  const link = togglbutton.createTimerLink({
    className: 'todoist-detail',
    description: description,
    projectName: project,
    tags: tags,
    buttonType: 'minimal'
  });

  const wrapper = document.createElement('div');
  wrapper.classList.add('item_action');
  wrapper.style.display = 'flex';
  wrapper.style.alignItems = 'center';
  wrapper.style.justifyContent = 'center';
  wrapper.appendChild(link);

  elem.insertBefore(wrapper, elem.firstChild);
});

// task view - subtasks
togglbutton.render(
  '.task_list_item .task_list_item__actions:not(.toggl)',
  { observe: true, observeTarget: todoistEditor, debounceInterval: 300 },
  elem => {
    const isButtonAdded = elem.querySelector('.toggl-button') !== null;

    if (isButtonAdded) {
      return;
    }

    const rootEl = elem.closest('.task_list_item');
    const content = rootEl.querySelector('.task_list_item__content');

    const descriptionSelector = () => {
      const text = content.querySelector('.task_content');
      return text ? text.textContent.trim() : '';
    };

    let project = '';
    const projectId = rootEl.getAttribute('data-item-id');

    if (document.getElementById(`item_${projectId}`)) {
      // (legacy?) project ID element
      const projectContent = document.getElementById(`item_${projectId}`).querySelector('.content');
      project = getProjectNames(projectContent);
    } else if (rootEl.querySelector('.task_list_item__project')) {
      // Project name shown alongside the task in UI
      project = rootEl.querySelector('.task_list_item__project').textContent.trim();
    } else {
      // Try to look for a parent item with a known project
      project = getParentIfProject(elem.closest('.item_detail'));
    }

    const tagsSelector = () => {
      const tags = content.querySelectorAll('.task_list_item__info_tags__label');

      return [...tags].map(tag => tag.textContent);
    };

    const link = togglbutton.createTimerLink({
      className: 'todoist-detail-subtask',
      description: descriptionSelector,
      projectName: project,
      buttonType: 'minimal',
      tags: tagsSelector
    });

    const wrapper = document.createElement('div');
    wrapper.style.display = 'flex';
    wrapper.style.marginTop = '3px';
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
  } else if ($('.task_list_item__project', elem.parentNode.parentNode)) {
    projectLabel = $('.task_list_item__project', elem).textContent.trim();
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

function getParentIfProject (elem) {
  if (!elem) return '';

  const parent = elem.querySelector('.item_detail_parent_info');
  let project = '';

  if (parent.querySelector('circle, .item_detail_parent_icon__inbox_icon')) {
    project = parent.querySelector('.item_detail_parent_name').textContent;
  }

  return project;
}
