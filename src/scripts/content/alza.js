/*jslint indent: 2 */
/*global $: false, document: false, togglbutton: false*/
'use strict';

togglbutton.render('.textlinks:not(.toggl)', {}, function (elem) {
  var link,
    description = $('Description', elem),
    project = $('Projects name', elem);


  link = togglbutton.createTimerLink({
    className: 'alza',
    description: description,
    projectName: project
  });

  $('.textlinks').appendChild(link);



});
