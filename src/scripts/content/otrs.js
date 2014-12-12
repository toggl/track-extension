/*jslint indent: 2 */
/*global $: false, document: false, togglbutton: false, createTag:false*/

'use strict';

togglbutton.render('.Headline:not(.toggl)', {observe: true}, function (elem) {
  var link, container = createTag('div', 'Headline-clear'),
    titleElem = $('.Headline h1', elem),    
    descriptionElem = $('.Flag');

  link = togglbutton.createTimerLink({
    className: 'otrs',
    description: titleElem.innerText,
	tags: 'otrs'
  });

  container.appendChild(link);
  descriptionElem.parentNode.insertBefore(container, descriptionElem);
});