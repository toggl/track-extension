'use strict';

togglbutton.render('.convo-actions:not(.toggl)', { observe: true }, function () {
  const description =
      '#' +
      $('#tkHeader strong').textContent +
      ' ' +
      $('#subjectLine').textContent;

  const link = togglbutton.createTimerLink({
    className: 'helpscout',
    description: description,
    buttonType: 'minimal'
  });

  link.setAttribute('style', 'margin-top: 10px');

  const listItem = document.createElement('li');
  listItem.appendChild(link);

  $('.convo-actions').appendChild(listItem);
});
