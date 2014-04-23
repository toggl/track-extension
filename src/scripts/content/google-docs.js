/*jslint indent: 2 */
/*global $: false, document: false, togglbutton: false*/
'use strict';

togglbutton.render('#docs-toolbar-wrapper', {}, function (elem) {
  var link, description,
    titleElem = $('.docs-title-inner');

  description = titleElem.innerText;

  link = togglbutton.createTimerLink({
    className: 'google-docs',
    description: description
  });

  $('#docs-toolbar-wrapper').appendChild(link);
});
