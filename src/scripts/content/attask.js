/*jslint indent: 2 */
/*global $: false, document: false, togglbutton: false*/
'use strict';


togglbutton.render('#layout-container:not(.toggl)', {observe: true}, function (elem) {
  var link,
  description;

  description = function(){
    var w_url = window.location.href,
    w_name = $('.detail-name-edit', elem).textContent;

    return w_name + ' ' + w_url;
  };

  link = togglbutton.createTimerLink({
    className: 'attask',
    description: description
  });

  // Create style tag
  var t_style = document.createElement("style");
  t_style.innerHTML = ".toggl-button{height: 62px;line-height: 62px;background-position: 1em 50%;padding: 0 1em 0 2.75em;}#nav-toggl{height: 62px; vertical-align: middle; } .toggl-button:hover{background-color:#eee !important;} .toggl-button.active{background-color:#f5f5f5;}";
  document.head.appendChild(t_style);

  // Create container element
  var t_container = document.createElement("li");
  t_container.id = "nav-toggl";
  t_container.className = "navbar-item";

  // Add Toggl button to container
  t_container.appendChild(link);

  // Add container to navbar
  var navgroup = document.querySelector('.navbar-item-group.right');
  navgroup.insertBefore(t_container, navgroup.children[0]);

});
