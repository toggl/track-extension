'use strict';

// Whole note
togglbutton.render('.IZ65Hb-TBnied:not(.toggl)', { observe: true }, function (
  elem
) {
  const toolbar = $('.IZ65Hb-INgbqf', elem);
  const description = $('.IZ65Hb-YPqjbf:not(.LwH6nd)', elem).textContent;

  const tagFunc = function () {
    let index;
    const tags = [];
    const tagItems = $('.IZ65Hb-jfdpUb', elem).children;

    for (index in tagItems) {
      if (tagItems.hasOwnProperty(index) && tagItems[index].classList.contains('notranslate')) {
        tags.push(tagItems[index].textContent);
      }
    }
    return tags;
  };

  const link = togglbutton.createTimerLink({
    className: 'keep',
    buttonType: 'minimal',
    description: description,
    tags: tagFunc
  });
  toolbar.appendChild(link);
});

// Checklist inside a note
togglbutton.render(
  '.IZ65Hb-TBnied .gkA7Yd-sKfxWe .CmABtb.RNfche:not(.toggl)',
  { observe: true },
  function (elem) {
    const position = $('.IZ65Hb-MPu53c-haAclf', elem);
    const description = elem.textContent;

    const link = togglbutton.createTimerLink({
      className: 'keep',
      buttonType: 'minimal',
      description: description
    });
    position.appendChild(link);
  }
);
