/*jslint indent: 2 */
/*global $: false, document: false, togglbutton: false*/

'use strict';

togglbutton.render('.convo-toolbar:not(.toggl)', {observe: true}, function () {

  var link,
    description = '#' + $('#tkHeader strong').innerHTML + ' ' + $('#subjectLine').innerHTML;

  link = togglbutton.createTimerLink({
    className: 'helpscout',
    description: description
  });

  link.setAttribute('style', 'margin-top: 10px');

  $('.convo-toolbar').appendChild(link);
});
