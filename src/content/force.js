/**
 * @name Salesforce Lightning
 * @urlAlias force.com
 * @urlRegex *://*.force.com/*,*://*.lightning.force.com/*
 */
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

const lightningSelector = (selector) => {
  // Navigate around many views being present in the DOM, hidden/revealed at various times
  return $(`.slds-template__container > .lafSinglePaneWindowManager >.windowViewMode-normal ${selector}`);
};

togglbutton.render(
  '.utilitybar.slds-utility-bar:not(.toggl)',
  { observe: true },
  function (elem) {
    const getDescription = () => {
      let description = lightningSelector('.slds-page-header__title .uiOutputText:not(.selectedListView)');
      const descriptionFromTitle = document.querySelector('title').textContent.split('| Salesforce').shift().trim()

      if (!description) description = lightningSelector('.slds-page-header__title lightning-formatted-name');
      if (!description) description = lightningSelector('.slds-page-header__title lightning-formatted-text');

      return description ? description.textContent.trim() : descriptionFromTitle;
    };

    const getProject = () => {
      // If there's localization these will fail, but we're mostly out of options.
      let project = lightningSelector('[title="Account Name"]');
      if (!project) project = lightningSelector('[title="Related To"]');
      if (!project) project = lightningSelector('[title="Company"]');

      if (project) {
        // We must try to go deep, since .textContent doesn't work at all on some components.
        let innerEl = project.nextSibling.querySelector('a');
        if (!innerEl) innerEl = project.nextSibling.querySelector('lightning-formatted-text');
        return innerEl ? innerEl.textContent.trim() : '';
      }
      return getDescription();
    };

    const link = togglbutton.createTimerLink({
      className: 'salesforce',
      description: getDescription,
      projectName: getProject
    });

    const wrapper = document.createElement('li');
    wrapper.classList.add('slds-utility-bar__item', 'slds-utility-bar__action', 'toggl-button-salesforce-wrapper');
    wrapper.appendChild(link);
    elem.appendChild(wrapper);
  }
);
