/*jslint indent: 2 */
/*global $: false, document: false, togglbutton: false*/
'use strict';

togglbutton.render('#docs-toolbar-wrapped', {}, function (elem) {
  var link, description,
    titleElem = $('.docs-title-inner');

  description = titleElem.innerText;

  link = togglbutton.createTimerLink({
    className: 'google-drive',
    description: description
  });

  $('#docs-toolbar-wrapped').appendChild(link);
});
