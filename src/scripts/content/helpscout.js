'use strict';

togglbutton.render('.convo-actions:not(.toggl)', { observe: true }, function() {
  var link,
    description =
      '#' +
      $('#tkHeader strong').textContent +
      ' ' +
      $('#subjectLine').textContent;

  link = togglbutton.createTimerLink({
    className: 'helpscout',
    description: description,
    buttonType: 'minimal'
  });

  link.setAttribute('style', 'margin-top: 10px');

  var listItem = document.createElement('li');
  listItem.appendChild(link);

  $('.convo-actions').appendChild(listItem);
});
