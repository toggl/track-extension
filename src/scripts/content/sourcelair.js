/*jslint indent: 2 */
/*global $: false, document: false, togglbutton: false*/
'use strict';

togglbutton.render('#ide:not(.toggl)', {observe: true}, function () {
  var link,
    projectFunc = function () {
      return $('.project-label .project-name').getAttribute('title');
    },
    descFunc = function () {
      return $('.project-label .after.actionable').innerHTML;
    },
    inlineCss = 'position: fixed; bottom: 1rem; right: 1rem; z-index: 9999;',
    container = document.createElement('div');

  container.setAttribute('id', 'toggl-sourceLair');
  container.setAttribute('style', inlineCss);

  link = togglbutton.createTimerLink({
    projectName: projectFunc,
    description: descFunc
  });

  container.appendChild(link);
  $('.editor-panel').appendChild(container);
});