'use strict';

togglbutton.render('#ide:not(.toggl)', { observe: true }, function () {
  const projectFunc = function () {
    return $('.project-label .project-name').getAttribute('title');
  };

  const descFunc = function () {
    return $('.project-label .after.actionable').textContent;
  };

  const inlineCss = 'position: fixed; bottom: 1rem; right: 1rem; z-index: 9999;';
  const container = document.createElement('div');

  container.setAttribute('id', 'toggl-sourceLair');
  container.setAttribute('style', inlineCss);

  const link = togglbutton.createTimerLink({
    projectName: projectFunc,
    description: descFunc
  });

  container.appendChild(link);
  $('.editor-panel').appendChild(container);
});
