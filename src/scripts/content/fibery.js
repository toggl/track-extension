'use strict';

/* global togglbutton, $ */

const renderTogglButton = () => {
  togglbutton.render('div.ObjectEditor:not(.toggl)', { observe: true }, $container => {
    const descriptionSelector = () => {
      const $description =
        $('.HeaderLayout textarea[name="product-development/name"]', $container) ||
        $('.HeaderLayout textarea[name="Wiki/name"]', $container);
      return $description.textContent.trim();
    };

    const link = togglbutton.createTimerLink({
      className: 'fibery',
      description: descriptionSelector
      // projectName: projectSelector
    });

    $('div.ObjectEditorHeader > .HeaderLayout').appendChild(link);
  });
};

renderTogglButton();
