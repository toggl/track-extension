/*jslint indent: 2 */
/*global $: false, document: false, togglbutton: false*/
'use strict';

togglbutton.render('.pa.Y:not(.toggl)', {}, function (elem) {
  var link,
    description = 'Handling e-mails';


  link = togglbutton.createTimerLink({
    className: 'google-inbox',
    description: description
  });

  $('.pa.Y').appendChild(link);



});
