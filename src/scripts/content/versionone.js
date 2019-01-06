'use strict';

togglbutton.render(
  '.inline-asset-detail .asset-summary:not(.toggl)',
  { observe: true },
  function(elem) {
    var link,
      description = $(
        '.main-panel .asset-heading #asset-title-mount .title',
        elem
      ).textContent,
      project = $(
        '.main-panel .main-panel-scroller .fields .text .asset-name-link span',
        elem
      ).textContent,
      container = $('.toolbar .utility', elem);

    link = togglbutton.createTimerLink({
      className: 'versionone',
      description: description,
      projectName: project,
      buttonType: 'minimal'
    });
    link.setAttribute('style', 'margin-right: 10px');
    container.insertBefore(link, $('.share', container));
  }
);
