/*jslint indent: 2 */
/*global $: false, document: false, togglbutton: false*/

'use strict';

togglbutton.render('.content-header:not(.toggl)', {observe: true}, function () {

  var link;
  var id = $('div.content-header-id').innerText;
  var title = $('div.content-header-title').innerText.trim();
  var description = '#' + id + ' ' + title;

  link = togglbutton.createTimerLink({
    className: 'testrail',
    description: description
  });

  link.setAttribute('style', 'margin-left: 5px');

  $('div.content-header-title').appendChild(link);
});
