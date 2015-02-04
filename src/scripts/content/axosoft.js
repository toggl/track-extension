/*jslint indent: 2 */
/*global $: false, document: false, togglbutton: false, createTag:false*/

'use strict';

togglbutton.render('.item-field-name input:not(.toggl)', {observe: true}, function (elem) {
  var link, titleText, projectText,
    wrapperElem = $('.axo-addEditItem-content'),
    titleElem = $('#name', wrapperElem),
    ratingElem = $('.axo-rating', wrapperElem);

  if(titleElem !== null) {
    titleText = titleElem.value;
  }
  
  link = togglbutton.createTimerLink({
    className: 'axosoft',
    description: titleText || ''
  });
  link.classList.add('edit');
  ratingElem.parentNode.insertBefore(link, ratingElem);
});


togglbutton.render('.axo-view-item-content .item-field-name:not(.toggl)', {observe: true}, function (elem) {
  var link, titleText, projectText,
    wrapperElem = $('.axo-view-item-content'),
    titleElem = $('.item-field-name', wrapperElem),
    ratingElem = $('.axo-rating', wrapperElem);

  if(titleElem !== null) {
    titleText = titleElem.innerText;
  }
  
  link = togglbutton.createTimerLink({
    className: 'axosoft',
    description: titleText || ''
  });
  link.classList.add('view');
  ratingElem.parentNode.insertBefore(link, ratingElem);
});