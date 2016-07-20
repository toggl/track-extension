/*jslint indent: 2 */
/*global $: false, document: false, togglbutton: false*/
'use strict';


togglbutton.render('#layout-container:not(.toggl)', {observe: true}, function (elem) {
  var link,
  description,
  project = $('.objectlink.breadcrumb-link.first-item', elem).textContent;

  description = function(){
    var delimiter = ' > ',
    w_type = window.location.pathname.split('/')[1],
    w_id = $('#layout-content').innerHTML.split('detailObjID":"')[1].split('"')[0],
    w_name = $('.detail-name-edit', elem).textContent;

    return w_type + delimiter + w_name + delimiter + w_id;
  };

  link = togglbutton.createTimerLink({
    className: 'attask',
    description: description,
    projectName: project
  });

  var t_style = document.createElement("style");
  t_style.innerHTML = ".toggl-button{height: 62px;line-height: 62px;background-position: 1em 50%;padding: 0 1em 0 2.75em;}#nav-toggl{height: 62px; vertical-align: middle; } .toggl-button:hover{background-color:#eee !important;} .toggl-button.active{background-color:#f5f5f5;}";
  document.head.appendChild(t_style);

  var t_container = document.createElement("li");
  t_container.id = "nav-toggl";
  t_container.className = "navbar-item";

  t_container.appendChild(link);

  var navgroup = document.querySelector('.navbar-item-group.right');
  navgroup.insertBefore(t_container, navgroup.children[0]);

});
