/*jslint indent: 2, unparam: true*/
/*global $: false, document: false, togglbutton: false*/

'use strict';

// Basecamp Next
togglbutton.render('section.todos li.todo:not(.toggl)', {observe: true}, function (elem) {
  var link, behavior = 'hover_content',
    container = $('.pill', elem), spanTag;

  if (container === null) {
    return;
  }

  link = togglbutton.createTimerLink({
    className: 'basecamp',
    description: $('.content_for_perma', elem).textContent,
    projectName: (!!$(".project")) ? ($(".project > title") || $(".project > header > h1 > a")).innerHTML : ""
  });

  link.setAttribute('data-behavior', behavior);
  link.addEventListener('click', function (e) {
    if (link.getAttribute('data-behavior') === '') {
      link.setAttribute('data-behavior', behavior);
    } else {
      link.setAttribute('data-behavior', '');
    }
  });

  spanTag = document.createElement("span");
  container.parentNode.appendChild(spanTag.appendChild(link));
});


// Basecamp Classic
togglbutton.render('.items_wrapper .item > .content:not(.toggl)', {observe: true}, function (elem) {
  var link, behavior = 'selectable_target', spanTag;

  link = togglbutton.createTimerLink({
    className: 'basecamphq',
    description: elem.querySelector('span.content > span').textContent.trim(),
    projectName: (!!$(".project")) ? ($(".project > title") || $(".project > header > h1 > a")).innerHTML : ""
  });

  link.setAttribute('data-behavior', '');
  link.addEventListener('click', function (e) {
    if (link.getAttribute('data-behavior') === '') {
      link.setAttribute('data-behavior', behavior);
    } else {
      link.setAttribute('data-behavior', '');
    }
  });

  spanTag = document.createElement("span");
  $(".content", elem).appendChild(spanTag.appendChild(link));
});
