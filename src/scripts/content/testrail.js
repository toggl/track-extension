/*jslint indent: 2 */
/*global $: false, document: false, togglbutton: false*/

'use strict';

togglbutton.render('.content-header:not(.toggl)', {observe: true}, function () {

  var link,
    id = $('div.content-header-id').innerText,
    title = $('div.content-header-title').innerText.trim(),
    description = '#' + id + ' ' + title;

  link = togglbutton.createTimerLink({
    className: 'testrail',
    description: description
  });

  link.setAttribute('style', 'margin-left: 5px');

  $('div.content-header-title').appendChild(link);
});
