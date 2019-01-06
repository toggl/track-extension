'use strict';
/* global togglbutton, $ */

togglbutton.render('#channel_name:not(.toggl)', { observe: true }, () => {
  const placeholder = $('.channel_title_info');
  const projectName = $('#team_name').textContent.trim();
  const description = $('#channel_name')
    .textContent.trim()
    .replace(/^#/, '');

  const link = togglbutton.createTimerLink({
    className: 'slack',
    description,
    projectName,
    buttonType: 'minimal'
  });

  placeholder.parentNode.insertBefore(link, placeholder);
});

togglbutton.render('.c-message--hover:not(.toggl)', { observe: true }, elem => {
  const placeholder = $('.c-message_actions__button:last-child');
  const description = $('.c-message__body', elem).textContent.trim();
  const projectName = $('#team_name').textContent.trim();
  const button = document.createElement('button');

  const link = togglbutton.createTimerLink({
    className: 'slack-message',
    projectName,
    description,
    buttonType: 'minimal'
  });

  button.className = 'c-button-unstyled c-message_actions__button';
  button.setAttribute('type', 'button');
  button.appendChild(link);

  placeholder.parentNode.insertBefore(button, placeholder);
});
