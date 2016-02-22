/*jslint indent: 2 */
/*global $: false, document: false, togglbutton: false*/
'use strict';

var sourceLair = {
  render: function(options) {
    var self = this;
    togglbutton.render('#app:not(.toggl)', {observe: true}, function (elem) {
      var link,
      project = $('span.project-name.value', elem).textContent,
      inlineCss = 'position: fixed; bottom: 1rem; right: 1rem; z-index: 9999;',
      container = document.createElement('div');

      container.setAttribute('id', 'toggl-sourceLair');
      container.setAttribute('style', inlineCss);

      link = togglbutton.createTimerLink({
        projectName: options.projectName || 'Project',
        description: options.description || 'Task description'
      });

      container.appendChild(link);
      $('.editor-panel').appendChild(container);
    });
  }
}

// It would be nice if we could listen to an IDE ready event.
setTimeout(function() {
  var project = $('.project-label .project-name').getAttribute('title');
  var description = $('.project-label .after.actionable').innerHTML;
  sourceLair.render({projectName: project, description: description});
}, 5000);
