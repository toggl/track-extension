/*jslint indent: 2 */
/*global $: false, document: false, togglbutton: false*/
'use strict';

togglbutton.render('#submenu:not(.toggl)', {observe: true}, function () {
  var link, description,
    titleElem = $('#mailing-name'),
    li = document.createElement('li');

  description = titleElem.value;

  link = togglbutton.createTimerLink({
    className: 'newsletter2go',
    description: description,
  });

  li.className = 'sm submenu center';
  li.appendChild(link);
  $('#submenu').appendChild(li);
});
