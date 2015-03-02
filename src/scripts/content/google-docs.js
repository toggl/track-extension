/*jslint indent: 2, unparam: true*/
/*global $: false, document: false, togglbutton: false*/
'use strict';

togglbutton.render('#docs-toolbar-wrapper:not(.toggl)', {}, function (elem) {
  var link, description, titleElem = $('.docs-title-inner');

  description = titleElem.innerText;

  link = togglbutton.createTimerLink({
    className: 'google-docs',
    description: description
  });
  if ($('#docs-menubars').style.display !== "none") {
    link = togglbutton.createTimerLink({
      className: 'google-docs',
      description: description
    });
    $('#docs-menubar').appendChild(link);
  } else {
    link = togglbutton.createTimerLink({
      className: 'google-docs',
      buttonType: 'minimal',
      description: description
    });
    $('#docs-toolbar').appendChild(link);
  }
});
