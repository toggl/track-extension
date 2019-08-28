'use strict';

// Salesforce legacy view

// Updated Listing view
togglbutton.render(
  '.bMyTask .list tr.dataRow:not(.toggl)',
  { observe: true },
  function (elem) {
    const container = elem.querySelectorAll(
      '.bMyTask .list tr.dataRow .dataCell a'
    )[0];
    if (container === null) {
      return;
    }

    const descFunc = () => {
      return container.textContent;
    };

    const projectFunc = () => {
      return (
        ($('.accountBlock .mruText') &&
          $('.accountBlock .mruText').textContent) ||
        ''
      );
    };

    const link = togglbutton.createTimerLink({
      className: 'salesforce-legacy',
      buttonType: 'minimal',
      description: descFunc,
      projectName: projectFunc
    });

    container.insertBefore(link, container.firstChild);
  }
);

// Detail view
togglbutton.render('#bodyCell:not(.toggl)', { observe: true }, function (elem) {
  const container = $('.content', elem);

  if (container === null) {
    return;
  }

  const parent = $('.pageType', container);

  if (!parent) {
    return;
  }

  const descFunc = () => {
    const desc = $('.pageDescription', container);
    return desc ? desc.textContent.trim() : '';
  };

  const projectFunc = () => {
    return (
      ($('.accountBlock .mruText') &&
        $('.accountBlock .mruText').textContent) ||
      ''
    );
  };

  const link = togglbutton.createTimerLink({
    className: 'salesforce-legacy',
    description: descFunc,
    projectName: projectFunc
  });

  parent.appendChild(link);
});

// Lightning Task List view/sidebar
togglbutton.render(
  '.slds-split-view__list-item:not(.toggl)',
  { observe: true },
  function (elem) {
    const getDescription = () => {
      return $('.uiOutputText', elem).textContent.trim();
    };

    const link = togglbutton.createTimerLink({
      className: 'salesforce-list',
      description: getDescription,
      buttonType: 'minimal'
    });

    $('.uiOutputText', elem).parentElement.parentElement.appendChild(link);
  }
);

togglbutton.render(
  '.slds-page-header__title:not(.toggl)',
  { observe: true },
  function (elem) {
    const description = $('.uiOutputText:not(.selectedListView)', elem);
    if (!description) {
      // Looks like a title not relevant to a record, ignore.
      return;
    }

    const getDescription = () => {
      return description.textContent.trim();
    };
    const getProject = () => {
      let project = $('[title="Account Name"]');
      if (!project) project = $('[title="Related To"]');

      if (project) {
        return project.nextSibling.textContent.trim();
      }
      return getDescription();
    };

    const link = togglbutton.createTimerLink({
      className: 'salesforce',
      description: getDescription,
      projectName: getProject,
      buttonType: 'minimal'
    });
    description.appendChild(link);
  }, 'header,.active,.oneRecordHomeFlexipage'
);
