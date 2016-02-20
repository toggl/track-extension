/*jslint indent: 2 */
/*global $: false, document: false, togglbutton: false*/
'use strict';

togglbutton.render('.devsite-page-title:not(.toggl)', {}, function (elem) {
  var link,
    description = $('h1').textContent;


  link = togglbutton.createTimerLink({
    className: 'developers-google',
    description: description
  });


  $('.devsite-page-title').appendChild(link);

});
