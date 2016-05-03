/*jslint indent: 2, unparam: true*/
/*global $: false, document: false, togglbutton: false*/

'use strict';

// Basecamp Next
togglbutton.render('section.todos li.todo:not(.toggl)', {observe: true}, function (elem) {
  var link, behavior = 'hover_content',
    container = $('.wrapper', elem), spanTag,
    projectFunc;

  if (container === null) {
    return;
  }

  projectFunc = function () {
    var p = $(".project > title") || $(".project > header > h1 > a");
    return p ? p.textContent : "";
  };

  link = togglbutton.createTimerLink({
    className: 'basecamp',
    description: $('.content_for_perma', elem).textContent,
    projectName: projectFunc
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
  container.appendChild(spanTag.appendChild(link));
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


// Basecamp 3
togglbutton.render('.todos li.todo:not(.toggl):not(.completed)', {observe: true}, function (elem) {
  var link, project,
    projectItem,
    description = $('.checkbox__content', elem);

  if (!description) {
    return;
  }

  description = description.childNodes[1].textContent;
  project = $('.checkbox__content', elem).parentNode.parentNode.parentNode.parentNode.parentNode;
  projectItem = $('.todolist__permalink', project);
  project = projectItem ? projectItem.textContent : "";

  link = togglbutton.createTimerLink({
    className: 'basecamp3',
    description: description,
    projectName: project
  });

  $('.todo_assignee', elem).appendChild(link);
});