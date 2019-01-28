'use strict';

// Updated Listing view
togglbutton.render(
  '.bMyTask .list tr.dataRow:not(.toggl)',
  { observe: true },
  function(elem) {
    var link,
      descFunc,
      projectFunc,
      container = elem.querySelectorAll(
        '.bMyTask .list tr.dataRow .dataCell a'
      )[0];
    if (container === null) {
      return;
    }

    descFunc = function() {
      return container.textContent;
    };

    projectFunc = function() {
      return (
        ($('.accountBlock .mruText') &&
          $('.accountBlock .mruText').textContent) ||
        ''
      );
    };

    link = togglbutton.createTimerLink({
      className: 'salesforce',
      buttonType: 'minimal',
      description: descFunc,
      projectName: projectFunc
    });

    container.insertBefore(link, container.firstChild);
  }
);

// Detail view
togglbutton.render('#bodyCell:not(.toggl)', { observe: true }, function(elem) {
  var link,
    descFunc,
    projectFunc,
    parent,
    container = $('.content', elem);

  if (container === null) {
    return;
  }

  parent = $('.pageType', container);

  if (!parent) {
    return;
  }

  descFunc = function() {
    var desc = $('.pageDescription', container);
    return desc ? desc.textContent.trim() : '';
  };

  projectFunc = function() {
    return (
      ($('.accountBlock .mruText') &&
        $('.accountBlock .mruText').textContent) ||
      ''
    );
  };

  link = togglbutton.createTimerLink({
    className: 'salesforce',
    description: descFunc,
    projectName: projectFunc
  });

  parent.appendChild(link);
});

// Lightning Task Detail view
togglbutton.render(
  '.runtime_sales_activitiesTaskCommon:not(.toggl)',
  { observe: true },
  function(elem) {
    const getDescription = () => {
      return $('.subject .uiOutputText', elem).textContent.trim()
    };

    const link = togglbutton.createTimerLink({
      className: 'salesforce-lightning',
      description: getDescription,
      buttonType: 'minimal'
    });

    $('.left', elem).appendChild(link);
  }
);

// Lightning Task List view/sidebar
togglbutton.render(
  '.slds-split-view__list-item:not(.toggl)',
  { observe: true },
  function (elem) {
    const getDescription = () => {
      return $('.uiOutputText', elem).textContent.trim();
    };

    const link = togglbutton.createTimerLink({
      className: 'salesforce-lightning-list',
      description: getDescription,
      buttonType: 'minimal'
    });

    $('.uiOutputText', elem).parentElement.parentElement.appendChild(link);
  }
);
