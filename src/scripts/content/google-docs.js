/*jslint indent: 2, unparam: true*/
/*global $: false, document: false, togglbutton: false*/
'use strict';

togglbutton.render('#docs-toolbar-wrapper', {}, function (elem) {
  var link, description, titleElem = $('.docs-title-inner');

  description = titleElem.innerText;

  link = togglbutton.createTimerLink({
    className: 'google-docs',
    description: description
  });

  $('#docs-menubar').appendChild(link);
});
