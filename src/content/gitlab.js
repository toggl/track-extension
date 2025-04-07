'use strict';

// Render on issue page
togglbutton.render(
  'div [type="issues"]',
  { observe: true },
  function (elem) {
    const prefix = [getId()].filter(Boolean)
      .map(function(id) { return "#" + id;})
      .join('');
    const description = [prefix, getIssueTitle(elem)].filter(Boolean).join(' ');

    insertButton($('button [data-testid="work-item-edit-form-button"]'), description, true);
    insertButton($('div [data-testid="work-item-time-tracking"]'), description);
  }
);

// Render on merge request page
togglbutton.render(
  '.merge-request > .detail-page-header:not(.toggl)',
  { observe: true },
  function (elem) {
    const prefix = [getId()].filter(Boolean)
      .map(function(id) { return "MR" + id + "::";})
      .join('');
    const description = [prefix, getMergeRequestTitle(elem)].filter(Boolean).join(' ');

    insertButton($('.detail-page-header-actions'), description, true);
    insertButton($('.time-tracker'), description);
  }
);

/**
 * @param $el
 * @param {String} description
 * @param {boolean} prepend
 */
function insertButton ($el, description, prepend = false) {
  const link = togglbutton.createTimerLink({
    className: 'gitlab',
    description: description,
    tags: tagsSelector,
    projectName: getProjectSelector
  });

  if (prepend) {
    $el.parentElement.insertBefore(link, $el);
  } else {
    $el.parentElement.appendChild(link, $el);
  }
}

function getIssueTitle (parent) {
  const el = parent.querySelector('[data-testid="work-item-title"]');

  return el ? el.textContent.trim() : '';
}

function getMergeRequestTitle (parent) {
  const el = parent.querySelector('.title');

  return el ? el.textContent.trim() : '';
}

function getId () {
  return document.querySelector('body').getAttribute('data-page-type-id');
}

function getProjectSelector () {
  const el = querySelector('a[data-track-label="project_overview"] div[data-testid="nav-item-link-label"]');
  return el ? el.textContent.trim() : '';
}

function tagsSelector () {
  const nodeList = document.querySelectorAll('[data-testid="selected-label-content"] span.gl-label-text');

  if (!nodeList) {
    return [];
  }

  const tags = [];

  for (const node of Object.values(nodeList)) {
    const tagName = node.textContent.trim();
    if (!tags.includes(tagName)) {
      tags.push(tagName);
    }
  }

  return tags;
}
