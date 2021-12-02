'use strict';

togglbutton.render(
  '.item-field-name input:not(.toggl)',
  { observe: true },
  function () {
    let titleText;
    const wrapperElem = $('.axo-addEditItem-content');
    const titleElem = $('#name', wrapperElem);
    const beforeElem =
        $('.axo-rating', wrapperElem) || $('.item-field-name', wrapperElem);

    if (titleElem !== null) {
      titleText = titleElem.value;
    }

    const link = togglbutton.createTimerLink({
      className: 'axosoft',
      description: titleText || ''
    });
    link.classList.add('edit');
    beforeElem.parentNode.insertBefore(link, beforeElem);
  }
);

togglbutton.render(
  '.axo-view-item-content .item-field-name:not(.toggl)',
  { observe: true },
  function () {
    const wrapperElem = $('.axo-view-item-content');
    const titleElem = $('.item-field-name', wrapperElem);
    const beforeElem = $('.axo-rating', wrapperElem) || titleElem;
    let titleText;

    if (titleElem !== null) {
      titleText = titleElem.textContent;
    }

    const link = togglbutton.createTimerLink({
      className: 'axosoft',
      description: titleText || ''
    });
    link.classList.add('view');
    beforeElem.parentNode.insertBefore(link, beforeElem);
  }
);
