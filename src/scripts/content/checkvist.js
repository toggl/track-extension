/*jslint indent: 2 */
/*global $: false, document: false, togglbutton: false*/
'use strict';

var toggleEnabledForCheckvistList = (function () {
  var togglTag = $('.tag_toggl');
  return togglTag !== null;
}());

togglbutton.render('li.nonDivider:not(.toggl)', {observe: true}, function (elem) {
  if (!toggleEnabledForCheckvistList) {
    return;
  }

  var description = $('.node_text', elem).textContent,
    projectName = $('#header_span').textContent,
    link = togglbutton.createTimerLink({
      className: 'checkvist',
      description: description,
      projectName: projectName
    });

  $(".coreDiv", elem).appendChild(link);
});