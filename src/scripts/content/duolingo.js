/*jslint indent: 2 */
/*global $: false, document: false, togglbutton: false*/
'use strict';

togglbutton.render('.skill-tree-header:not(.toggl)', {}, function (elem) {
  var link,
    description = $('h1').textContent;


  link = togglbutton.createTimerLink({
    className: 'duolingo',
    description: description

  });

  $('.skill-tree-header').appendChild(link);

});
