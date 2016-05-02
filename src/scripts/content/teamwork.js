/*jslint indent: 2 */
/*global $: false, document: false, togglbutton: false, createTag:false*/

'use strict';

// Tasks listing page in project
togglbutton.render('div.taskRHS:not(.toggl)', {observe: true}, function (elem) {
  var link, spanTag, desc,
    className = 'huh',
    container = $('.taskIcons', elem),
    projectFunc = function () {
      if ($("#projectName")) {
        return $("#projectName").childNodes[0].textContent.trim();
      }
      return "";
    };

  if (container === null) {
    return;
  }

  if ($('.taskName', elem) === null) {
    return;
  }

  desc = $('.taskName', elem).textContent;

  link = togglbutton.createTimerLink({
    className: 'teamworkpm',
    description: desc,
    projectName: projectFunc
  });

  link.classList.add(className);
  link.addEventListener('click', function () {

    // Run through and hide all others
    var i, len, elems = document.querySelectorAll(".toggl-button");
    for (i = 0, len = elems.length; i < len; i += 1) {
      elems[i].classList.add('huh');
    }

    if (link.classList.contains(className)) {
      link.classList.remove(className);
    } else {
      link.classList.add(className);
    }
  });

  spanTag = document.createElement("span");
  spanTag.classList.add("toggl-span");
  link.style.width = 'auto';
  link.style.paddingLeft = '20px';
  link.setAttribute("title", "Toggl Timer");
  spanTag.appendChild(link);
  container.insertBefore(spanTag, container.lastChild);
});

// Tasks Detail View Page
togglbutton.render('div#Task div.titleHolder ul.options:not(.toggl)', {observe: true}, function (elem) {
  var link, liTag, titleEl, desc,
    projectFunc = function () {
      if ($("#projectName")) {
        return $("#projectName").childNodes[0].textContent.trim();
      }
      return "";
    };

  liTag = document.createElement("li");
  liTag.classList.add("toggl-li");

  titleEl = document.getElementById("Task");
  desc = titleEl.getAttribute("data-taskname");

  link = togglbutton.createTimerLink({
    className: 'teamworkpm',
    description: desc,
    projectName: projectFunc
  });

  link.classList.add("btn");
  link.classList.add("btn-default");
  liTag.appendChild(link);
  elem.insertBefore(liTag, elem.firstChild);

});