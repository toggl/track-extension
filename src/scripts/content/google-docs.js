'use strict';

togglbutton.render('#docs-bars:not(.toggl)', {}, function (elem) {
  const titleFunc = function () {
    const title = $('.docs-title-input');
    return title ? title.value : '';
  };

  const link = togglbutton.createTimerLink({
    className: 'google-docs',
    description: titleFunc
  });
  $('#docs-menubar').appendChild(link);
});
