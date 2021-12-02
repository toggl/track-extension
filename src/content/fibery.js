'use strict';

/* global togglbutton, $ */

const renderTogglButton = () => {
  togglbutton.render('div.ObjectEditor:not(.toggl)', { observe: true }, $container => {
    const descriptionSelector = () => {
      const $description = $('.HeaderLayout textarea', $container);
      return $description ? $description.textContent.trim() : '';
    };

    const link = togglbutton.createTimerLink({
      className: 'fibery',
      description: descriptionSelector
    });

    $('div.ObjectEditorHeader > .HeaderLayout').appendChild(link);
  });
};

renderTogglButton();
