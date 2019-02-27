'use strict';

togglbutton.render('.editor__header:not(.toggl)', { observe: true }, function (
  elem
) {
  const tabs = $('.editor__switch-mode', elem);

  const description = function () {
    return document.querySelector('.editor-title__input').value;
  };

  if ($('.toggl-button')) {
    return;
  }

  const link = togglbutton.createTimerLink({
    className: 'wordpress',
    description: description
  });

  tabs.parentElement.insertBefore(link, tabs);
});
