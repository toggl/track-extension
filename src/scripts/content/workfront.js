/*jslint indent: 2 */
/*global $: false, document: false, togglbutton: false, window: false*/
'use strict';

console.info('Loaded Toggl Button');

// Single task/issue/project in main view
togglbutton.render('#layout-container:not(.toggl)', {observe: true}, function (elem) {
  var link,
    t_container,
    navgroup,
    description = function () {
      var w_name = $('.detail-name-edit', elem).textContent;

      return w_name + ' ' + window.location.href;
    };

  link = togglbutton.createTimerLink({
    className: 'workfront',
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

// Multiple tasks in project view
var t = document.querySelector("#minified-scripts").innerHTML;
var user_name = /\/user\/view.*?label:\"(.*?)\"/.exec(t)[1];
var myTasks = document.querySelectorAll(`td[data-workvalue*="${user_name}"]`);

myTasks.forEach(function(e){
  var objid = e.parentElement.getAttribute('objid');
  var taskName = e.parentElement.querySelector('td[valuefield=name]');
  var l = taskName.querySelector('.objectlink');
  var url = l.href;
  var name = l.innerText;
  if(url.length>30 && name.length>3){
    togglbutton.render(`[objid="${objid}"]:not(.toggl)`, {observe: true}, function (elem) {
      var link;
      var taskName = elem.querySelector('td[valuefield=name]');
      var l = taskName.querySelector('.objectlink');
      var url = l.href;
      var name = l.innerText;
      var description = function () {
          return name + ' ' + url;
        };

      link = togglbutton.createTimerLink({
        className: 'workfront',
        description: description,
        buttonType: 'minimal'
      });

      // Add Toggl button to container
      var nameDiv = taskName.querySelector('div');
      var nameDivSpan = nameDiv.querySelector('span');
      nameDiv.insertBefore(link, nameDivSpan);
    });
  }
});