/*jslint indent: 2 */
/*global $: false, togglbutton: false, createTag: false*/

'use strict';

togglbutton.render('#title-heading:not(.toggl)', {observe: true}, function (elem) {
  var link, description,
    titleElem = $('[id="title-text"]', elem);

  description = titleElem.innerText;

  link = togglbutton.createTimerLink({
    className: 'confluence',
    description: description
  });

  $('#title-text').appendChild(link);
});