/*jslint indent: 2 */
/*global $: false, document: false, togglbutton: false*/
'use strict';

togglbutton.render('.IZ65Hb-TBnied:not(.toggl)', {observe: true}, function (elem) {
  var link,
      container = createTag('div', 'keep-tb-wrapper'),
      toolbar = $('.IZ65Hb-INgbqf', elem),
      description = $('.IZ65Hb-YPqjbf:not(.LwH6nd)', elem).innerText;
  link = togglbutton.createTimerLink({
    className: 'keep',
    description: description,
    projectName: ""
  });
  container.appendChild(link);
  toolbar.appendChild(container);
});
