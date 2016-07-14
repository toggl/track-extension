/*jslint indent: 2 */
/*global $: false, document: false, togglbutton: false, createTag:false, Promise: false*/

'use strict';

// Tasks listing page in project
togglbutton.render('div.taskRHS:not(.toggl), div.row-rightElements:not(.toggl)', {observe: true}, function (elem) {
  var link, spanTag, desc,
    isTKO = false,
    className = 'huh',
    container = $('.taskIcons', elem),
    project = $("#projectName > span").textContent;

  if (container === null) {
    // check if TKO container is there
    container = $('.task-options', elem);
    isTKO = true;
    if (container === null) {
      // remove class so we re-check after async data is loaded
      elem.classList.remove('toggl');
      return;
    }
  }

  if ($('.taskName', elem) === null) {
    // check if TKO element is there
    if ($('p.task-name a', elem.parentElement) !== null) {
      desc = $('p.task-name a', elem.parentElement).textContent;
    } else {
      return;
    }
  } else {
    desc = $('.taskName', elem).textContent;
  }

  link = togglbutton.createTimerLink({
    className: 'teamwork',
    description: desc,
    projectName: project
  });

  if (isTKO) {
    // different behaviour in TKO
    link.classList.add('option');
  } else {
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
  }

  spanTag = document.createElement("span");
  spanTag.classList.add("toggl-span");
  link.style.width = 'auto';
  if (isTKO) {
    // different styling due to different layout in TKO
    link.style.paddingLeft = '25px';
    link.style.transform = 'scale(1)';
    link.style.fontSize = '13px';
    link.style.marginRight = '10px';
  } else {
    link.style.paddingLeft = '20px';
  }
  link.setAttribute("title", "Toggl Timer");
  spanTag.appendChild(link);
  if (isTKO) {
    // need to use parent, some <a>'s can be nested e.g. HubSpot integration,
    // can't just use "unused icons" container as the layout has changed
    container.insertBefore(spanTag, container.parentElement.querySelector('.task-options > a:not(.active)'));
  } else {
    container.insertBefore(spanTag, container.lastChild);
  }
});

// Tasks Detail View Page
togglbutton.render('div#Task div.titleHolder ul.options:not(.toggl), .view-header ul.task-details-options:not(.toggl)', {observe: true}, function (elem) {
  var link, liTag, desc,
    project = $("#projectName > span").textContent;

  liTag = document.createElement("li");
  liTag.classList.add("toggl-li");

  // TKO data is loaded asynchronously,
  // get task name using exponential backoff
  // if using new UI
  new Promise(function (resolve, reject) {
    var titleEl = document.getElementById("Task"),
      setDesc;
    if (titleEl === null) {
      // TKO support
      setDesc = function (timeout) {
        if (timeout > 1000 * 60 * 5) {
          reject();
        }
        titleEl = document.querySelector('p.task-name a');
        if (titleEl === null) {
          setTimeout(function () {
            setDesc(timeout * 2);
          }, timeout);
        } else {
          desc = titleEl.textContent;
          resolve();
        }
      };
      setDesc();
    } else {
      desc = titleEl.getAttribute("data-taskname");
      resolve();
    }
  }).then(function () {
    link = togglbutton.createTimerLink({
      className: 'teamwork',
      description: desc,
      projectName: project
    });

    link.classList.add("btn");
    link.classList.add("btn-default");
    liTag.appendChild(link);
    elem.insertBefore(liTag, elem.firstChild);
  }).catch(function () {
    return;
  });
});