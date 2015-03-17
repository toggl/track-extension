/*jslint indent: 2, unparam: true*/
/*global $: false, createTag: false, togglbutton: false*/

'use strict';

togglbutton.render('.item-topbar:not(.toggl)', {observe: true}, function (elem) {
  var delay = 1000; //1 second
  setTimeout(function () {
    var link, wrapper,
      description = $('.item-title', elem),
      container = $('.breadcrumb', elem);

    if (description === null || container === null) {
      return;
    }

    link = togglbutton.createTimerLink({
      className: 'podio',
      description: description.innerText
    });

    wrapper = createTag('div', 'item-via');
    wrapper.appendChild(link);
    container.parentNode.insertBefore(wrapper, container.nextSibling);
  }, delay);
});


togglbutton.render('.task-detail:not(.toggl)', {observe: true}, function (elem) {
  var link, wrapper,
    description = $('.task-link', elem.parentNode),
    container = $('.edit-task-reference-wrapper', elem);

  if (description === null || container === null) {
    return;
  }

  link = togglbutton.createTimerLink({
    className: 'podio',
    description: description.innerText
  });

  wrapper = createTag('div', 'task-via');
  wrapper.appendChild(link);
  container.parentNode.insertBefore(wrapper, container.nextSibling);
});


togglbutton.render('.task-header:not(.toggl)', {observe: true}, function (elem) {
  var link, wrapper,
    container = $('.action-bar ul', elem),
    description = $('.header-title', elem);

  if (description === null || container === null) {
    return;
  }

  link = togglbutton.createTimerLink({
    className: 'podio',
    description: description.innerText
  });

  wrapper = createTag("li", "float-left");
  wrapper.appendChild(link);
  container.appendChild(wrapper);
});
