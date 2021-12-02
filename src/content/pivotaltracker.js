'use strict';

togglbutton.render('form.story:not(.toggl)', { observe: true }, function (elem) {
  const titleElem = $('textarea', elem);
  const id = $('.id.text_value', elem);
  const container = $('.edit aside', elem);
  const projectName = $('title').textContent;

  if (titleElem === null || container === null) {
    return;
  }

  const link = togglbutton.createTimerLink({
    className: 'pivotal',
    description: id.value + ' ' + titleElem.value,
    projectName: projectName && projectName.split(' -').shift()
  });

  container.appendChild(link);
});
