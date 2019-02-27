'use strict';

togglbutton.render(
  '.issue-details .detail-page-description:not(.toggl)',
  { observe: true },
  function (elem) {
    const numElem =
        $('.identifier') ||
        $('.breadcrumbs-list li:last-child .breadcrumbs-sub-title');

    const titleElem = $('.title', elem);

    const projectElem =
        $('.title .project-item-select-holder') ||
        $('.breadcrumbs-list li:nth-last-child(3) .breadcrumb-item-text');

    const actionsElem = $('.detail-page-header-actions');
    let description = titleElem.textContent.trim();
    if (numElem !== null) {
      description =
        numElem.textContent
          .split(' ')
          .pop()
          .trim() +
        ' ' +
        description;
    }

    const link = togglbutton.createTimerLink({
      className: 'gitlab',
      description: description,
      projectName: projectElem.textContent
    });

    actionsElem.parentElement.insertBefore(link, actionsElem);
  }
);

togglbutton.render(
  '.merge-request-details .detail-page-description:not(.toggl)',
  { observe: true },
  function (elem) {
    const numElem =
        $('.identifier') ||
        $('.breadcrumbs-list li:last-child .breadcrumbs-sub-title');
    const titleElem = $('.title', elem);
    const projectElem =
        $('.title .project-item-select-holder') ||
        $('.breadcrumbs-list li:nth-last-child(3) .breadcrumb-item-text');
    const actionsElem = $('.detail-page-header-actions');

    let description = titleElem.textContent.trim();

    if (numElem !== null) {
      description =
        'MR' +
        numElem.textContent
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
      projectName: projectElem.textContent
    });

    actionsElem.parentElement.insertBefore(link, actionsElem);
  }
);
