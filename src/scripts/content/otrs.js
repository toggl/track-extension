/*jslint indent: 2 */
/*global $: false, togglbutton: false, createTag: false*/

'use strict';

togglbutton.render('.Headline:not(.toggl)', {observe: true}, function (elem) {
  var link, description = '', container, ul, li,
    titleElem = $('h1', elem);
    /*projectElem = $('#project-name-val', elem);*/


  link = togglbutton.createTimerLink({
    className: 'otrs',
    description: titleElem.innerText,
    projectName: 'otrs'
  });

  /*$('.Headline').appendChild(link);*/
  /*container  = $('.SidebarColumn .Content');
  container.insertBefore(link, container.childNodes[0]);*/
  li = createTag('li', '');
  li.appendChild(link);
  $('.ActionRow .Actions').appendChild(li);
});
