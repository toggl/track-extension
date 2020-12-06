'use strict';

togglbutton.render('.pane_header:not(.toggl)', { observe: true }, function (
  elem
) {
  let description;
  const projectName = $('title').textContent;

  const titleFunc = function () {
    const titleElem = $('.editable .ember-view input', elem);
    const ticketNum = location.href.match(/tickets\/(\d+)/);

    if (titleElem !== null) {
      description = titleElem.value.trim();
    }

    if (ticketNum) {
      description = '#' + ticketNum[1].trim() + ' ' + description;
    }
    return description;
  };

  const link = togglbutton.createTimerLink({
    className: 'zendesk',
    description: titleFunc,
    projectName: projectName && projectName.split(' - ').shift()
  });

  // Check for strange duplicate buttons. Don't know why this happens in Zendesk.
  const $toggl = $('.toggl-button', elem);
  if ($toggl) {
    elem.removeChild($toggl);
  }

  elem.insertBefore(link, $('.btn-group', elem));
});

togglbutton.render('[data-test-id="customer-context-tab-navigation"]', { observe: true }, function (
  elem
) {
  // Manual check for existence in this SPA.
  if ($('.toggl-button', elem)) return;

  const titleFunc = function () {
    let description;

    const ticketNum = location.href.match(/tickets\/(\d+)/);

    if (ticketNum) {
      const id = ticketNum[1].trim();
      const titleElem = $(`[data-side-conversations-anchor-id="${id}"] [data-test-id="ticket-pane-subject"]`, document);

      if (titleElem !== null) {
        description = titleElem.value.trim();
      }

      description = '#' + id + ' ' + description;
    }

    return description;
  };

  const link = togglbutton.createTimerLink({
    className: 'zendesk-agent-ws',
    description: titleFunc
  });

  elem.prepend(link);
});
