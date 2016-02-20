/*jslint indent: 2 */
/*global $: false, document: false, togglbutton: false*/
'use strict';

togglbutton.render('.general-header-right:not(.toggl)', {}, function (elem) {
  var link,
    description = 'Learning at Udemy.com';


  link = togglbutton.createTimerLink({
    className: 'udemy',
    description: description
  });


  $('.general-header-right').appendChild(link);

});
