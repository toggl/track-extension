'use strict';

togglbutton.render('#channel_name:not(.toggl)', { observe: true }, function() {
  var link,
    placeholder = $('.channel_title_info'),
    project = $('#team_name').textContent,
    description = $('#channel_name')
      .textContent.trim()
      .replace(/^#/, '');

  link = togglbutton.createTimerLink({
    className: 'slack',
    description: description,
    projectName: project,
    buttonType: 'minimal'
  });

  placeholder.parentNode.insertBefore(link, placeholder);
});

togglbutton.render('.c-message--hover:not(.toggl)', { observe: true }, function(
  elem
) {
  var link,
    placeholder = $('.c-message_actions__button--last-child'),
    description = $('.c-message__body', elem).textContent,
    project = $('#team_name').textContent,
    button = document.createElement('button');

  link = togglbutton.createTimerLink({
    className: 'slack-message',
    projectName: project,
    description: description,
    buttonType: 'minimal'
  });

  button.className = 'c-button-unstyled c-message_actions__button';
  button.setAttribute('type', 'button');
  button.appendChild(link);

  placeholder.parentNode.insertBefore(button, placeholder);
});
