/*jslint indent: 2 */
/*global $: false, document: false, togglbutton: false*/
'use strict';
togglbutton.render('.ui-dialog:not(.toggl)', {observe: true}, function (elem) {
  var link,
    description = document.getElementsByClassName("value")[0].textContent,
    project = $('#pagetitle a').textContent;
    console.log(project);

  link = togglbutton.createTimerLink({
      className: 'coredata',
      description: description,
      projectName: project
    });

  $('.actions.buttons.form').appendChild(link);

});
