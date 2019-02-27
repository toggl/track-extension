'use strict';

togglbutton.render('#dokuwiki__content', { observe: false }, function (elem) {
  const numElem = $('.pageId span');
  const pName = numElem.textContent.split(':')[0].trim();
  const target = $('.wrapper.group') || $('.pageId'); // DokuWiki Template // Bootstrap3 Template

  const description = numElem.textContent
    .split(' ')
    .pop()
    .trim();
  const link = togglbutton.createTimerLink({
    className: 'wiki',
    description: description,
    projectName: pName
  });

  target.prepend(link);
});
