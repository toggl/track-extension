'use strict';

togglbutton.render(
  '.issue-details .detail-page-description:not(.toggl)',
  { observe: true },
  function (elem) {
    const breadcrumbsSubTitle = getBreadcrumbsSubTitle();

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

    insertButton($('.detail-page-header-actions'), description, true);
    insertButton($('.time_tracker'), description);
  }
);

togglbutton.render(
  '.merge-request-details > .detail-page-description:not(.toggl)',
  { observe: true },
  function (elem) {
    const breadcrumbsSubTitle = getBreadcrumbsSubTitle();

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

    insertButton($('.detail-page-header-actions'), description, true);
    insertButton($('.time_tracker'), description);
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

function getProjectSelector () {
  const $el = $('.title .project-item-select-holder') || $('.breadcrumbs-list li:nth-last-child(3) .breadcrumb-item-text');
  return $el ? $el.textContent.trim() : '';
}

function tagsSelector () {
  // GitLab 13.5
  const nodeList = document.querySelectorAll('div.labels span[data-qa-label-name]');

  if (!nodeList) {
    return [];
  }

  const tags = [];

  for (const node of Object.values(nodeList)) {
    const tagName = node.getAttribute('data-qa-label-name');
    tags.push(tagName);
  }

  return tags;
}
