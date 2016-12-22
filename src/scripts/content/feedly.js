/*jslint indent: 2 */
/*global $: false, document: false, togglbutton: false, createTag: false*/
'use strict';

togglbutton.render('.entryHeader:not(.toggl)', {observe: true}, function (elem) {
  var link,
    textnode = document.createTextNode("\u00A0//\u00A0 "),
    description = $('.entryTitle', elem).textContent;

  link = togglbutton.createTimerLink({
    className: 'feedly',
    description: description
  });

  $('.entryHeader > .metadata').appendChild(textnode);
  $('.entryHeader > .metadata').appendChild(link);
});
