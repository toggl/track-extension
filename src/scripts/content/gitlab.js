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
  const $tagList = $('div[data-qa-selector="labels_block"]');

  if (!$tagList) {
    return [];
  }

  const tagItems = $tagList.children;
  const tags = [];

  for (const node of Object.values(tagItems)) {
    const tagName = node.textContent.trim();
    // Skip no labels: <span className="no-value">None</span>
    if (tagName === 'None') {
      continue;
    }
    tags.push(tagName);
  }

  return tags;
}
