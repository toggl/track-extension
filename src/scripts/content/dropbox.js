/*jslint indent: 2 */
/*global $: false, document: false, togglbutton: false*/
'use strict';

togglbutton.render('#main-nav:not(.toggl)', {}, function (elem) {
  var link,
    description = 'Dropbox';


  link = togglbutton.createTimerLink({
    className: 'dropbox',
    description: description
  });


  $('#main-nav').appendChild(link);

});
