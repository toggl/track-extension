/*jslint indent: 2 */
/*global $: false, document: false, togglbutton: false, createTag:false*/

'use strict';

togglbutton.render('.item-field-name input:not(.toggl)', {observe: true}, function () {
  var link, titleText,
    wrapperElem = $('.axo-addEditItem-content'),
    titleElem = $('#name', wrapperElem),
    beforeElem = $('.axo-rating', wrapperElem) || $('.item-field-name', wrapperElem);

  if (titleElem !== null) {
    titleText = titleElem.value;
  }

  link = togglbutton.createTimerLink({
    className: 'axosoft',
    description: titleText || ''
  });
  link.classList.add('edit');
  beforeElem.parentNode.insertBefore(link, beforeElem);
});


togglbutton.render('.axo-view-item-content .item-field-name:not(.toggl)', {observe: true}, function () {
  var link, titleText,
    wrapperElem = $('.axo-view-item-content'),
    titleElem = $('.item-field-name', wrapperElem),
    beforeElem = $('.axo-rating', wrapperElem) || titleElem;

  if (titleElem !== null) {
    titleText = titleElem.innerText;
  }

  link = togglbutton.createTimerLink({
    className: 'axosoft',
    description: titleText || ''
  });
  link.classList.add('view');
  beforeElem.parentNode.insertBefore(link, beforeElem);
});