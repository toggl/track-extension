/**
 * @name Zendesk
 * @urlAlias zendesk.com
 * @urlRegex *://*.zendesk.com/*
 */

'use strict';

// Zendesk new UI Jul 2021
setTimeout(() => {
  togglbutton.render(
    '.omni-conversation-pane>div>div:first-child:not(.toggl)',
    { observe: true },
    (elem) => {
      const getProject = () => {
        const title = document.querySelector('title');
        return title ? title.textContent.trim() : '';
      };

      const getDescription = () => {
        const ticketId = document.querySelector('header div[data-selected=true]').attributes['data-entity-id'].value || ''

        const input = elem.querySelector('input[data-test-id=omni-header-subject]')
        const title = (input ? input.value : '').trim();

        return [`#${ticketId}`, title].filter(Boolean).join(' ');
      };

      const link = togglbutton.createTimerLink({
        buttonType: 'minimal',
        className: 'zendesk--2021',
        description: getDescription,
        projectName: getProject
      });

      elem.appendChild(link);
    }
  );
}, 1000);


// Zendesk new UI Apr 2023
setTimeout(() => {
  togglbutton.render(
    '[data-garden-id="pane"]:not(.toggl)',
    { observe: true },
    function (elem) {
      if (elem.id === ':r1:--primary-pane') return
      let description;
      const projectName = $('title').textContent;

      const titleFunc = function () {
        const titleElem = $('[data-test-id="omni-header-subject"]', elem);
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
      if (document.querySelector('.toggl-button')) {
        document.removeChild(elem.querySelector('.toggl-button'));
      }
      elem.querySelector('[data-side-conversations-anchor-id="1"]').firstChild
                                                                   .firstChild
                                                                   .firstChild
                                                                   .appendChild(link);
    }
  );
}, 1000);

// Zendesk new UI Sept 2023
setTimeout(() => {
  togglbutton.render(
    '.ticket-panes-grid-layout.active',
    { observe: true },
    function (elem) {
      const elements = document.querySelectorAll('.ticket-panes-grid-layout:not(.active) .toggl-button')
      if(elements.length > 0) {
        elements.forEach(element => element.remove())
      }
      const activeButtonExists = document.querySelector('.ticket-panes-grid-layout.active .toggl-button')
      if(activeButtonExists) return

      let description;
      const projectName = $('title').textContent;

      const titleFunc = function () {
        const titleElem = $('[data-test-id="omni-header-subject"]', elem);
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
        className: 'zendesk-button',
        description: titleFunc,
        projectName: projectName && projectName.split(' – ').shift(),
        buttonType: 'minimal'
      });


      elem.querySelector('[data-support-suite-trial-onboarding-id="conversationPane"] > div:nth-child(1)').lastChild.prepend(link);
    },
    ''
  );
}, 1000);

// Zendesk pre-2021
setTimeout(() => {
  togglbutton.render(
    '.pane_header:not(.toggl)',
    { observe: true },
    function (elem) {
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
      if (elem.querySelector('.toggl-button')) {
        elem.removeChild(elem.querySelector('.toggl-button'));
      }

      elem.insertBefore(link, elem.querySelector('.btn-group'));
    }
  );
}, 1000);

const getDescription = () => {
  const ticketNum = location.href.match(/tickets\/(\d+)/);

  if (!ticketNum) return null;
  const id = ticketNum[1].trim();
  const titleElem = document.querySelector(
    `[data-side-conversations-anchor-id="${id}"] input[aria-label="Subject"]`
  );
  if (!titleElem) return null;

  return '#' + id + ' ' + titleElem.value.trim();
};

setTimeout(() => {
  togglbutton.render(
    '[data-test-id="customer-context-tab-navigation"]',
    { observe: true },
    function (elem) {
      // Manual check for existence in this SPA.
      if (elem.querySelector('.toggl-button')) return;
      // If we can't get the description on this pass, let's skip and wait for the next one
      if (!getDescription()) return;

      const link = togglbutton.createTimerLink({
        className: 'zendesk-agent-ws',
        description: getDescription
      });

      elem.prepend(link);
    }
  );
}, 1000);
