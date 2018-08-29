'use strict';

togglbutton.render('#docs-bars:not(.toggl)', {}, function(elem) {
  var link, titleFunc;

  titleFunc = function() {
    var title = $('.docs-title-input');
    return title ? title.value : '';
  };

  link = togglbutton.createTimerLink({
    className: 'google-docs',
    description: titleFunc
  });
  $('#docs-menubar').appendChild(link);
});
