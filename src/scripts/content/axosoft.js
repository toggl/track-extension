/*jslint indent: 2 */
/*global $: false, document: false, togglbutton: false, createTag:false*/

'use strict';

togglbutton.render('.item-field-name input:not(.toggl)', {observe: true}, function () {
  var link, titleText,
    wrapperElem = $('.axo-addEditItem-content'),
    titleElem = $('#name', wrapperElem),
    ratingElem = $('.axo-rating', wrapperElem);

  if (titleElem !== null) {
    titleText = titleElem.value;
  }

  link = togglbutton.createTimerLink({
    className: 'axosoft',
    description: titleText || ''
  });
  link.classList.add('edit');
  ratingElem.parentNode.insertBefore(link, ratingElem);
});


togglbutton.render('.axo-view-item-content .item-field-name:not(.toggl)', {observe: true}, function () {
  var link, titleText,
    wrapperElem = $('.axo-view-item-content'),
    projectText = $(".item-field-table .item-field-row .item-field-inner-right .field", wrapperElem),
    titleElem = $('.item-field-name', wrapperElem),
    ratingElem = $('.axo-rating', wrapperElem);

  if (titleElem !== null) {
    titleText = titleElem.innerText;
  }

  link = togglbutton.createTimerLink({
    className: 'axosoft',
    description: titleText || '',
    projectName: projectText && projectText.textContent
  });
  link.classList.add('view');
  ratingElem.parentNode.insertBefore(link, ratingElem);
});