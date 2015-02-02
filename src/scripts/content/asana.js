/*jslint indent: 2 */
/*global $: false, document: false, togglbutton: false*/

'use strict';

togglbutton.render('.details-pane-body:not(.toggl)', {observe: true}, function (elem) {

  var link, descFunc,
    container = $('.sticky-view-placeholder', elem),
    description = $('#details_property_sheet_title', elem),
    project = $('#details_pane_project_tokenizer .token_name', elem);

  descFunc = function () {
    return description.value;
  };

  link = togglbutton.createTimerLink({
    className: 'asana',
    description: descFunc,
    projectName: project && project.textContent
  });

  container.parentNode.insertBefore(link, container.nextSibling);
});
