/*jslint indent: 2 */
/*global $: false, document: false, togglbutton: false*/
'use strict';

togglbutton.render('.textlinks:not(.toggl)', {}, function (elem) {
  var link,
    description = 'Shopping';


  link = togglbutton.createTimerLink({
    className: 'alza',
    description: description
  });

  $('.textlinks').appendChild(link);



});
