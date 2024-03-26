"use strict";

const possibleButtons = document.getElementsByClassName("toggl-button");

const element = document.querySelector(
  '[data-component-selector="jira.issue-view.issue-details.full-size-mode-column"]'
);

togglbutton.render(
  // The main "issue link" at the top of the issue.
  "#jira-issue-header:not(.toggl)",
  { observe: true },
  function (elem) {
    const issueWrapper = elem.querySelector(
      '[data-testid="issue.views.issue-base.foundation.breadcrumbs.breadcrumb-current-issue-container"]'
    );
    let issueNumberElement;
    let container;

    if (issueWrapper) {
      issueNumberElement = issueWrapper;
      container = issueWrapper.parentElement;
    } else {
      container = elem.querySelector("[class^=BreadcrumbsContainer]");
      issueNumberElement = container.lastElementChild;
    }

    if (container.querySelector(".toggl-button")) {
      // We're checking for existence of the button as re-rendering in Jira SPA is not reliable for our uses.
      if (process.env.DEBUG) {
        console.info('🚫 "Jira 2020-01 issue detail" quit rendering early');
      }
      return;
    }
    try {
      const link = togglbutton.createTimerLink({
        className: "jira2018",
        projectName: (projects, tasks) => {
          const taskName = getDescription();
          const foundTask = findTaskByName(tasks, taskName);
          if (!foundTask) return null;
          const foundProject = projects?.[foundTask?.project_id];
          return foundProject;
        },
        container: "#jira-issue-header",
        taskId: (projects, tasks) => {
          const taskName = getDescription();
          const foundTask = findTaskByName(tasks, taskName);
          return foundTask;
        },
      });
      container.appendChild(link);
    } catch (e) {
      console.log(e);
    }
  }
);

let taskMemoCache = {};

function findTaskByName(tasks, taskName) {
  // Check if result is in cache
  if (taskMemoCache[taskName]) {
    return taskMemoCache[taskName];
  }

  const taskIds = Object.keys(tasks).filter(
    (id) => tasks[id].name === taskName
  );
  const foundTask = taskIds.length > 0 ? tasks[taskIds[0]] : null;
  // Store result in cache before returning
  taskMemoCache[taskName] = foundTask;

  return foundTask;
}

const getDescription = () => {
  let description = "";

  const titleElement = document.querySelector(
    'h1[data-testid="issue.views.issue-base.foundation.summary.heading"]'
  );
  if (titleElement) {
    if (description) description += " ";
    description += titleElement.textContent.trim();
  }
  const taskId = description.split("-")[0].trim();
  return taskId;
};
