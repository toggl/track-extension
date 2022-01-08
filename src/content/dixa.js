'use strict';

togglbutton.render(
  // Specify selector for element button needs to hook into
  // Make sure to include :not(.toggl) to avoid duplicates
  '.conversation-view__main [class^=conversationHeader__]:not(.toggl)',
  { observe: true },
  function (elem) {

    const getConversationId = () => {
      const csid = document.querySelector('.conversation-view__main button span').textContent;
      const title = document.querySelector('.conversation-view__main [class^=conversationHeader__] [class^=headline__] p').textContent;
      return `${csid} ${title}`;
    };

    const getProject = () => {
      const subdomain = window.location.host.replace(".dixa.com", "");
      return subdomain;
    }

    // Create timer link element
    const link = togglbutton.createTimerLink({
      description: getConversationId,
      buttonType: 'minimal',
      projectName: getProject,
      className: 'dixa'
    });

    // Add link to element
    const host = elem.querySelector('[class^=topActions__] [class^=root__]')
    host.insertBefore(link, null);
  }
);
