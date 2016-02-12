/*jslint indent: 2 */
/*global $: false, document: false, togglbutton: false*/
'use strict';

togglbutton.render('.user-nav:not(.toggl)', {}, function (elem) {
  var link,
    description = $('Description', elem),
    project = $('Projects name', elem);


  link = togglbutton.createTimerLink({
    className: 'pcpartpicker',
    description: description,
    projectName: project
  });


  $('.user-nav').appendChild(link);

});
