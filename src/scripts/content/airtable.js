/*jslint indent: 2 */
/*global $: false, document: false, togglbutton: false*/

'use strict';

togglbutton.render('.detailViewWithActivityFeedBase .dialog > .header > .flex-auto:not(.toggl)', {observe: true}, function (elem) {

  var link, descFunc, projectFunc,
    container = $('.justify-center > .relative', elem),
    description = $('.truncate.flex-auto.line-height-3', elem);

  descFunc = function () {
    return !!description ? description.innerText : "";
  };

  link = togglbutton.createTimerLink({
    className: 'airtable',
    description: descFunc
  });

  container.appendChild(link);
});
