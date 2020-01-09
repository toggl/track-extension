'use strict';

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
      tags: tagsSelector,
      projectName: getProjectSelector
    });

    actionsElem.parentElement.insertBefore(link, actionsElem);
  }
);

togglbutton.render(
  '.merge-request-details .detail-page-description:not(.toggl)',
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
      tags: tagsSelector,
      projectName: getProjectSelector
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
