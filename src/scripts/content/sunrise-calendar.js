/*jslint indent: 2 */
/*global $: false, document: false, togglbutton: false, createTag:false*/
'use strict';

togglbutton.render('.dialog__main:not(.toggl)', {observe: true}, function (elem) {
  var link,
    container = createTag('a', 'btn btn--small btn float-left'),
    titleElem = $('.form-title p', elem),
    dialogElem = $('.dialog__footer', elem);

  link = togglbutton.createTimerLink({
    className: 'sunrise-calendar',
    description: titleElem.textContent,
  });

  container.appendChild(link);
  dialogElem.appendChild(container);
});
