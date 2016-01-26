/*jslint indent: 2 */
/*global $: false, document: false, togglbutton: false*/
'use strict';

togglbutton.render('#channel_header_actions:not(.toggl)', {}, function (elem) {
  var link,
    description = $('Description', elem),
    project = $('Projects name', elem);


  link = togglbutton.createTimerLink({
    className: 'slack',
    description: description,
    projectName: project
  });



  $('#channel_header_actions').appendChild(link);

});
