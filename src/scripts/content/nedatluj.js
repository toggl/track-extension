/*jslint indent: 2 */
/*global $: false, document: false, togglbutton: false*/
'use strict';

togglbutton.render('.lesson-bread.center-block:not(.toggl)', {}, function (elem) {
  var link,
    description = $('.active').innerText,
    project = $('Projects name', elem);


  link = togglbutton.createTimerLink({
    className: 'nedatluj',
    description: description
  });


  $('.lesson-bread.center-block').appendChild(link);

});
