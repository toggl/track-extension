'use strict';

// Zendesk new UI Jul 2021
togglbutton.render('.omni-conversation-pane [class^=styles__Header]:not(.toggl)', { observe: true }, elem => {
  const getProject = () => {
    const title = document.querySelector('title');
    return title ? title.textContent.trim() : '';
  };

  const getDescription = () => {
    const input = elem.querySelector('[class^=styles__Left] input');
    return (input ? input.value : '').trim();
  };

  const link = togglbutton.createTimerLink({
    buttonType: 'minimal',
    className: 'zendesk',
    description: getDescription,
    projectName: getProject
  });

  elem.insertBefore(link, elem.querySelector('[class^=styles__Right]'));
});
