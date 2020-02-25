'use strict';

// jsonata jsonataExpression for tags, must return an array of tags
// @see http://docs.jsonata.org/overview.html
// http://try.jsonata.org/Hkg_K4EZL
const jsonataExpression = `
{
  "projectName" : project.name,
  "tags": labels
}
`;

togglbutton.render(
  '.issue-details .detail-page-description:not(.toggl)',
  { observe: true },
  function (elem) {
    const breadcrumbsSubTitle = getBreadcrumbsSubTitle();
    const actionsElem = $('.detail-page-header-actions');

    let description = getTitle(elem);
    if (breadcrumbsSubTitle) {
      description =
        breadcrumbsSubTitle
          .split(' ')
          .pop()
          .trim() +
        ' ' +
        description;
    }

    const link = togglbutton.createTimerLink({
      className: 'gitlab',
      description: description,
      ...buildParameters(jsonataExpression)
    });

    actionsElem.parentElement.insertBefore(link, actionsElem);
  }
);

togglbutton.render(
  '.merge-request-details > .detail-page-description:not(.toggl)',
  { observe: true },
  function (elem) {
    const breadcrumbsSubTitle = getBreadcrumbsSubTitle();
    const actionsElem = $('.detail-page-header-actions');

    let description = getTitle(elem);
    if (breadcrumbsSubTitle) {
      description =
        'MR' +
        breadcrumbsSubTitle
          .split(' ')
          .pop()
          .trim()
          .replace('!', '') +
        '::' +
        description;
    }

    const link = togglbutton.createTimerLink({
      className: 'gitlab',
      description: description,
      ...buildParameters(jsonataExpression)
    });

    actionsElem.parentElement.insertBefore(link, actionsElem);
  }
);

function getTitle (parent) {
  const $el = $('.title', parent);

  return $el ? $el.textContent.trim() : '';
}

function getBreadcrumbsSubTitle () {
  const $el =
    $('.identifier') ||
    $('.breadcrumbs-list li:last-child .breadcrumbs-sub-title');

  return $el ? $el.textContent.trim() : '';
}

function getProjectName () {
  const $el = $('.title .project-item-select-holder') || $('.breadcrumbs-list li:nth-last-child(3) .breadcrumb-item-text');
  return $el ? $el.textContent.trim() : '';
}

function getProjectPath () {
  const $el = $('a[data-qa-selector="project_link"]');

  return $el ? $el.getAttribute('href') : null;
}

function buildParameters (expression) {
  const json = {
    project: {
      name: getProjectName(),
      path: getProjectPath()
    },
    labels: getLabels()
  };

  let parameters = [];
  try {
    parameters = window.jsonata(expression).evaluate(json);
  } catch (e) {
    console.error('jsonata error', e);
  }

  return parameters;
}

function getLabels () {
  const $tagList = $('div[data-qa-selector="labels_block"]');

  if (!$tagList) {
    return [];
  }

  const tagItems = $tagList.children;
  const tags = [];
  let index;

  for (index in tagItems) {
    if (tagItems.hasOwnProperty(index)) {
      const tagName = tagItems[index].textContent.trim();
      // Skip no labels: <span className="no-value">None</span>
      if (tagName === 'None') {
        continue;
      }
      tags.push(tagName);
    }
  }

  return tags;
}
