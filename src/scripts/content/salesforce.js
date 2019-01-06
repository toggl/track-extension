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

// Lightning
togglbutton.render(
  '.runtime_sales_activitiesTaskCommon.runtime_sales_activitiesTaskRow:not(.toggl)',
  { observe: true },
  function(elem) {
    var link, descFunc, projectFunc;

    descFunc = function() {
      return $('.subject .uiOutputText', elem).textContent;
    };

    projectFunc = function() {
      return $('.runtime_sales_activitiesTaskContentFields ul').lastChild
        .textContent;
    };

    link = togglbutton.createTimerLink({
      className: 'salesforce-lightning',
      description: descFunc,
      projectName: projectFunc,
      buttonType: 'minimal'
    });

    $('.left', elem).appendChild(link);
  }
);
