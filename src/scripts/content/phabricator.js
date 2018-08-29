'use strict';

// Workboard view
togglbutton.render(
  '#phabricator-standard-page-body .phui-workpanel-view .phui-oi:not(.toggl)',
  { observe: true },
  function(elem) {
    var link,
      description = $('.phui-oi-name', elem).textContent.trim(),
      projectName = $(
        '.phui-crumb-view[href^="/project/profile"]:not(.phabricator-last-crumb), .phui-header-view > a'
      ).textContent.trim();

    link = togglbutton.createTimerLink({
      className: 'phabricator',
      buttonType: 'minimal',
      description: description,
      projectName: projectName
    });

    $('.phui-oi-name', elem).appendChild(link);
  }
);

// Task detail view
togglbutton.render(
  '#phabricator-standard-page-body:not(.toggl)',
  { observe: true },
  function(elem) {
    var link,
      wrap = document.createElement('li', 'phabricator-action-view'),
      container = $('.phabricator-action-list-view', elem),
      desc = elem.querySelector(
        '.phui-two-column-header .phui-header-view .phui-header-header'
      ),
      number = $('.phabricator-last-crumb .phui-crumb-name') || '',
      projectName = $('.phabricator-handle-tag-list-item > a');

    if (!!number) {
      number = number.textContent.trim() + ' ';
    }

    projectName = !!projectName ? projectName.textContent.trim() : '';

    link = togglbutton.createTimerLink({
      className: 'phabricator',
      description: number + desc.textContent,
      projectName: projectName
    });

    wrap.appendChild(link);
    container.prepend(wrap);
  }
);
