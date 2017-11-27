/*jslint indent: 2 */
/*global $: false, togglbutton: false, createTag: false*/

'use strict';

togglbutton.render('.pd-overview__title:not(.toggl)', {observe: true}, function () {
  /*jslint browser:true */
  var link, description,
    projectElem = $('.pd-service-name');

  description = document.title.replace(/\[#(\d*)\]([\w\W]*) - PagerDuty/g, 'Pagerduty $1:$2');

  link = togglbutton.createTimerLink({
    className: 'pagerduty',
    description: description,
    projectName: projectElem && projectElem.textContent
  });

  $('.pd-overview__title').appendChild(link);
});
