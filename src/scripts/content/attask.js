/*jslint indent: 2 */
/*global $: false, document: false, togglbutton: false, window: false*/
'use strict';


togglbutton.render('#layout-container:not(.toggl)', {observe: true}, function (elem) {
  var link,
    t_container,
    navgroup,
    description = function () {
      var w_name = $('.detail-name-edit', elem).textContent;

      return w_name + ' ' + window.location.href;
    };

  link = togglbutton.createTimerLink({
    className: 'attask',
    description: description
  });

  // Create container element
  t_container = document.createElement("li");
  t_container.id = "nav-toggl";
  t_container.className = "navbar-item";
  t_container.setAttribute("style", "height: 62px; vertical-align: middle;");

  // Add Toggl button to container
  t_container.appendChild(link);

  // Add container to navbar
  navgroup = document.querySelector('.navbar-item-group.right');
  navgroup.insertBefore(t_container, navgroup.children[0]);
});
