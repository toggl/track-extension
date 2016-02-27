/*jslint indent: 2 */
/*global $: false, document: false, togglbutton: false*/
'use strict';

togglbutton.render('.user-nav:not(.toggl)', {}, function (elem) {
  var link,
    description = $('h1').textContent;


  link = togglbutton.createTimerLink({
    className: 'pcpartpicker',
    description: description
  });


  $('.user-nav').appendChild(link);

});
