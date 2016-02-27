/*jslint indent: 2 */
/*global $: false, document: false, togglbutton: false*/
'use strict';

togglbutton.render('.collapse-wrapper:not(.toggl)', {}, function (elem) {
  var link,
    description = 'Looking at Lego.com',
    project = 'Lego.com';


  link = togglbutton.createTimerLink({
    className: 'lego',
    description: description,
    projectName: project
  });


  $('.collapse-wrapper').appendChild(link);

});
