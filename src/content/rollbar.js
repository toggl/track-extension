'use strict';

togglbutton.render(
  '#item-title-control:not(.toggl)',
  { observe: true },
  function () {
    const descriptionEl = $('.item-detail-page-header__item-title');
    const projectEl = $('#navbar-content > ul > li > a');
    const description = ((descriptionEl && descriptionEl.textContent) || '').trim();
    const projectName = ((projectEl && projectEl.textContent) || '').trim();
    const link = togglbutton.createTimerLink({
      className: 'rollbar',
      description,
      projectName
    });

    $('.item-status-level-area').appendChild(link);
  }
);
