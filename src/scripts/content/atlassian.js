'use strict';

const browser = require('webextension-polyfill');

// Jira 2017 board sidebar
togglbutton.render(
  '#ghx-detail-view [spacing] h1:not(.toggl)',
  { observe: true },
  function () {
    if (process.env.DEBUG) {
      console.info('🏃 "Jira 2017 sidebar" rendering');
    }

    const rootElem = $('#ghx-detail-view');
    const container = createTag('div', 'jira-ghx-toggl-button');
    const titleElem = $('[spacing] h1', rootElem);
    const numElem = $('[spacing] a', rootElem);
    const projectElem = $('.bgdPDV');
    const epic = getEpic();
    let description = epic + titleElem.textContent;
    if (numElem !== null) {
      description = numElem.textContent + ' ' + description;
    }

    const link = togglbutton.createTimerLink({
      className: 'jira2017',
      description: description,
      buttonType: 'minimal',
      projectName: projectElem && projectElem.textContent
    });

    container.appendChild(link);
    numElem.parentNode.appendChild(container);
  }
);

// Issue page 2019-06-20
togglbutton.render(
  'div[class*="Droplist-"] + div a[href^="/browse/"]:not(.toggl)',
  { observe: true },
  function (elem) {
    const issueNumberElement = elem;
    const container = issueNumberElement.parentElement.parentElement.parentElement;

    if (container.querySelector('.toggl-button')) {
      // We're checking for existence of the button as re-rendering in Jira SPA is not reliable for our uses.
      if (process.env.DEBUG) {
        console.info('🚫 "Jira 2019-06 issue page" quit rendering early');
      }
      return;
    }

    if (process.env.DEBUG) {
      console.info('🏃 "Jira 2019-06 issue page" rendering');
    }

    // const link = togglbutton.createTimerLink({
    //   className: 'jira2018',
    //   description: () => {
    //     const epic = getEpic();

    //     return epic + getDescription(issueNumberElement)();
    //   },
    //   // projectName: getProject
    //   // projectName: getProjectId
    //   projectId: getProjectId
    // });

    // container.appendChild(link);

    const createLink = (projectId) => {
      if (container.querySelector('.toggl-button')) {
        return;
      }

      const link = togglbutton.createTimerLink({
        className: 'jira2018',
        description: () => {
          const epic = getEpic();
          return epic + getDescription(issueNumberElement)();
        },
        projectId: projectId
      });

      container.appendChild(link);
    };

    addLinkWithProject(createLink);
  }
);

// Jira 2019-06-20 board page. Uses functions for timer values due to SPA on issue-lists.
togglbutton.render(
  // The main "issue link" at the top of the issue.
  'div[class*="GridColumnElement__GridColumn-"]:first-child a[href^="/browse/"]:not(.toggl)',
  { observe: true },
  function (elem) {
    const issueNumberElement = elem;
    const container = issueNumberElement.parentElement.parentElement.parentElement;

    if (container.querySelector('.toggl-button')) {
      // We're checking for existence of the button as re-rendering in Jira SPA is not reliable for our uses.
      if (process.env.DEBUG) {
        console.info('🚫 "Jira 2019-06 board page" quit rendering early');
      }
      return;
    }

    if (process.env.DEBUG) {
      console.info('🏃 "Jira 2019-06 board page" rendering');
    }

    // const link = togglbutton.createTimerLink({
    //   className: 'jira2018',
    //   description: () => {
    //     const epic = getEpic();

    //     return epic + getDescription(issueNumberElement)();
    //   },
    //   // projectName: getProject
    //   // projectName: getProjectId
    //   projectId: getProjectId
    // });

    // container.appendChild(link);

    const createLink = (projectId) => {
      if (container.querySelector('.toggl-button')) {
        return;
      }

      const link = togglbutton.createTimerLink({
        className: 'jira2018',
        description: () => {
          const epic = getEpic();
          return epic + getDescription(issueNumberElement)();
        },
        projectId: projectId
      });

      container.appendChild(link);
    };

    addLinkWithProject(createLink);
  }
);

const getDescription = (issueNumberElement) => () => {
  let description = '';
  // Title/summary of the issue - we use the hidden "edit" button that's there for a11y
  // in order to avoid picking up actual page title in the case of issue-list-pages.
  const titleElement = document.querySelector('h1 ~ button[aria-label]');

  if (issueNumberElement) {
    description += issueNumberElement.textContent.trim();
  }

  if (titleElement && titleElement.previousSibling) {
    if (description) description += ' ';
    description += titleElement.previousSibling.textContent.trim();
  }

  return description;
};

// This was removed due to Eslint error

// function getProject () {
//   let project = '';
//   let projectElement;

//   // Best effort to find the "Project switcher" found in the sidebar of most pages, and extract
//   // the project name from that. Historically project has not always been picked up reliably in Jira.
//   projectElement = $('[data-test-id="navigation-apps.project-switcher-v2"] button > div:nth-child(2) > div');
//   // Attempt to find the project name in page subtitle in case the sidebar is hidden
//   if (!projectElement) projectElement = $('a[href^="/browse/"][target=_self]');

//   if (projectElement) {
//     project = projectElement.textContent.trim();
//   }

//   return project;
// }

// Jira 2017 issue page
togglbutton.render(
  '.issue-header-content:not(.toggl)',
  { observe: true },
  function (elem) {
    if (process.env.DEBUG) {
      console.info('🏃 "Jira 2017 issue page" rendering');
    }
    const numElem = $('#key-val', elem);
    const titleElem = $('#summary-val', elem) || '';
    let projectElem = $('.bgdPDV');
    const epic = getEpic();
    let description;

    if (titleElem) {
      description = epic + titleElem.textContent.trim();
    }

    if (numElem !== null) {
      if (description) {
        description = ' ' + description;
      }
      description = numElem.textContent + description;
    }

    if (projectElem === null) {
      projectElem = $('[data-test-id="navigation-apps.project-switcher-v2"] button > div:nth-child(2) > div');
    }
    // JIRA server support
    if (projectElem === null) {
      projectElem = $('#project-name-val');
    }

    const link = togglbutton.createTimerLink({
      className: 'jira2017',
      description: description,
      projectName: projectElem && projectElem.textContent.trim()
    });

    link.style.marginLeft = '8px';

    const issueLinkContainer =
      ($('.issue-link') || {}).parentElement || ($('.aui-nav li') || {}).lastElementChild;
    issueLinkContainer && issueLinkContainer.appendChild(link);
  }
);

// Jira pre-2017
togglbutton.render('#ghx-detail-issue:not(.toggl)', { observe: true }, function (
  elem
) {
  const container = createTag('div', 'ghx-toggl-button');
  const titleElem = $('[data-field-id="summary"]', elem);
  const numElem = $('.ghx-fieldname-issuekey a');
  const projectElem = $('.ghx-project', elem);
  const epic = getEpic();
  let description = epic + titleElem.textContent;
  if (numElem !== null) {
    description = numElem.textContent + ' ' + description;
  }

  const link = togglbutton.createTimerLink({
    className: 'jira',
    description: description,
    projectName: projectElem && projectElem.textContent
  });

  container.appendChild(link);
  $('#ghx-detail-head').appendChild(container);
});

// Jira pre-2017
togglbutton.render(
  '.issue-header-content:not(.toggl)',
  { observe: true },
  function (elem) {
    let description;
    const numElem = $('#key-val', elem);
    const titleElem = $('#summary-val', elem) || '';
    const projectElem = $('#project-name-val', elem);
    const epic = getEpic();

    if (titleElem) {
      description = titleElem.textContent;
    }

    if (numElem !== null) {
      if (description) {
        description = ' ' + description;
      }
      description = numElem.textContent + description;
    }

    const link = togglbutton.createTimerLink({
      className: 'jira',
      description: epic + description,
      projectName: projectElem && projectElem.textContent
    });

    const ul = createTag('ul', 'toolbar-group');
    const li = createTag('li', 'toolbar-item');
    li.appendChild(link);
    ul.appendChild(li);
    $('.toolbar-split-left').appendChild(ul);
  }
);

// Confluence
togglbutton.render('#title-heading:not(.toggl)', { observe: true }, function (
  elem
) {
  const epic = getEpic();
  const titleElem = $('[id="title-text"]', elem);
  const description = epic + titleElem.textContent.trim();

  const link = togglbutton.createTimerLink({
    className: 'confluence',
    description: description
  });

  $('#title-text').appendChild(link);
});

function getEpic () {
  let epic = '';
  const breadcrumbs = document.querySelectorAll("#jira-issue-header [class^='BreadcrumbsItem_'] span > span");
  if (breadcrumbs && breadcrumbs.length > 1) {
    epic = breadcrumbs[0].innerHTML + ' / ';
  }

  return epic;
}

function getProjectOpenAir () {
  let project = '';
  const headers = document.querySelectorAll('h2');
  if (headers) {
    const arr = Array.from(headers);
    const projHeader = arr.find(h => h.textContent === 'OpenAir Project information');
    if (projHeader) {
      const projElem = projHeader.parentNode.parentNode.querySelector("[class^='Content-'] > div > div");
      if (projElem) {
        project = projElem.textContent;
      }
    }
  }

  return project;
}

function getTaskOpenAir () {
  let task = '';
  const headers = document.querySelectorAll('h2');
  if (headers) {
    const arr = Array.from(headers);
    const taskheader = arr.find(h => h.textContent === 'OpenAir Task information');
    if (taskheader) {
      const taskElem = taskheader.parentNode.parentNode.querySelector("[class^='Content-'] > div > div");
      if (taskElem) {
        task = taskElem.textContent;
      }
    }
  }

  return task;
}

function getProjectId (project, task) {
  const client = togglbutton.user.clients.find(c => c.name === project);
  if (client) {
    const proj = togglbutton.user.projects.find(p => p.cid === client.id && p.name === task);
    if (proj) {
      return proj.id;
    }
  }
}

function createProject (task, clientObj, workspaceId) {
  if (!(task && clientObj && workspaceId)) {
    return Promise.resolve();
  }

  const projectObj = togglbutton.user.projects.find(p => p.name === task && p.cid === clientObj.id);
  if (projectObj) {
    return Promise.resolve(projectObj);
  }

  return backgroundApiCall(
    { project: { name: task, wid: workspaceId, /* "is_private":true, */ cid: clientObj.id } },
    'https://www.toggl.com/api/v8/projects',
    'POST'
  ).then(res => {
    if (res.data && res.data.id) {
      console.log('created project', res.data);
      return res.data;
    }
  });
}

function createClient (project, workspaceId) {
  if (!(project && workspaceId)) {
    return Promise.resolve();
  }

  const client = togglbutton.user.clients.find(c => c.name === project);
  if (client) {
    return Promise.resolve(client);
  }

  return backgroundApiCall(
    { client: { name: project, wid: workspaceId } },
    'https://www.toggl.com/api/v8/clients',
    'POST'
  ).then(res => {
    if (res.data && res.data.id) {
      console.log('created client: ', res.data);
      return res.data;
    }
  });
}

function backgroundApiCall (payload, url, method) {
  // Send to background script
  return browser.runtime.sendMessage({
    type: 'apiCall',
    payload: payload,
    url: url,
    method: method
  });
}

function addNewProject (project, task) {
  const workspaceId = togglbutton.user.workspaces[0].id;
  return createClient(project, workspaceId)
    .then(clientObj => {
      return createProject(task, clientObj, workspaceId);
    })
    .then(projectObj => {
      return browser.runtime.sendMessage({ type: 'sync', respond: true })
        .then(res => {
          return projectObj;
        });
    });
}

function addLinkWithProject (createLink) {
  setTimeout(() => {
    const project = getProjectOpenAir();
    const task = getTaskOpenAir();
    const projId = getProjectId(project, task);
    if (projId || !(project && task)) {
      console.log(projId, project, task);
      createLink(projId);
    } else {
      console.log(projId, project, task);
      addNewProject(project, task)
        .then(projectObj => {
          createLink(projectObj ? projectObj.id : undefined);
        });
    }
  }, 750);
}
