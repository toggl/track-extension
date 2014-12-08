/*jslint indent: 2 */
/*global $: false, document: false, togglbutton: false, createTag:false*/

'use strict';

// Tasks listing page in project
togglbutton.render('div.taskRHS:not(.toggl)', {observe: true}, function (elem) {
  var link, spanTag, projectName, desc,
    className = 'huh',
    container = $('.taskIcons', elem);

  if (container === null) {
    return;
  }

  if ($('.taskName', elem) === null) {
    return;
  }

  if ($("#projectName")) {
    projectName = $("#projectName").innerHTML;
  }

  desc = $('.taskName', elem).textContent;

  link = togglbutton.createTimerLink({
    className: 'teamworkpm',
    description: desc,
    projectName: projectName
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

// Tasks View Page
togglbutton.render('div#Task div.titleHolder ul.options:not(.toggl)', {observe: true}, function (elem) {
  var link, liTag, titleEl, projectName, desc;
  liTag = document.createElement("li");
  liTag.classList.add("toggl-li");

  titleEl = document.getElementById("Task");
  desc = titleEl.getAttribute("data-taskname");

  if ($("#projectName")) {
    projectName = $("#projectName").innerHTML;
  }

  link = togglbutton.createTimerLink({
    className: 'teamworkpm',
    description: desc,
    projectName: projectName
  });

  link.classList.add("btn");
  link.classList.add("btn-default");
  link.setAttribute("title", "Toggl Timer");
  liTag.appendChild(link);
  elem.insertBefore(liTag, elem.firstChild);

});