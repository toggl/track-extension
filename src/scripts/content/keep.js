/*jslint indent: 2 */
/*global $: false, document: false, togglbutton: false*/
'use strict';

togglbutton.render('.IZ65Hb-TBnied:not(.toggl)', {observe: true}, function (elem) {
  var link,
    toolbar = $('.IZ65Hb-INgbqf', elem),
    description = $('.IZ65Hb-YPqjbf:not(.LwH6nd)', elem).innerText;

  link = togglbutton.createTimerLink({
    className: 'keep',
    buttonType: 'minimal',
    description: description,
    projectName: ""
  });
  toolbar.appendChild(link);
});
