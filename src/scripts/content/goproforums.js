/*jslint indent: 2 */
/*global $: false, document: false, togglbutton: false*/
'use strict';

togglbutton.render('.socialIcons:not(.toggl)', {}, function (elem) {
  var link,
    description = $('strong').textContent;


  link = togglbutton.createTimerLink({
    className: 'goproforums',
    description: description
  });


  $('.socialIcons').appendChild(link);

});
