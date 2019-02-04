'use strict';

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
