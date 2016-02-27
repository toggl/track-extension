/*jslint indent: 2 */
/*global $: false, document: false, togglbutton: false*/
'use strict';

togglbutton.render('.color_h1:not(.toggl)', {}, function (elem) {
  var link,
    description = $('h1').textContent;


  link = togglbutton.createTimerLink({
    className: 'w3schools',
    description: description
  });


  $('.color_h1').appendChild(link);

});
