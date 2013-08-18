/*jslint indent: 2 */
/*global document: false */
"use strict";

function $(s, elem) {
  elem = elem || document;
  return elem.querySelector(s);
}

function createTag(name, className, child) {
  var tag = document.createElement(name);
  if (className !== undefined) tag.className = className;
  
  if (child !== undefined) {
    if (typeof child === 'string') {
      child = document.createTextNode(child);
    }
    tag.appendChild(child);
  }
  return tag;
}

function createLink(className) {
  var link = createTag('a', className, 'Start timer');
  link.href = '#';
  return link;
}

function createOption(id, cid, text) {
  var option = document.createElement("option");
  option.setAttribute("value", id);
  option.setAttribute("data-client-id", cid);
  option.text = text;
  return option;
}

function createGroupedProjectSelect(userData, className, currentProjectId) {
  var groups = {};

  var select = createTag('select', className);
  select.appendChild(createTag('option', 'meta-option', "none")).value = 'default';

  // Create one optgroup per workspace.
  for (var i = 0; i < userData.workspaces.length; i++) {
    groups[userData.workspaces[i].id] = select.appendChild(createTag('optgroup'));
    groups[userData.workspaces[i].id].label = userData.workspaces[i].name;
  }

  // Add the projects to their workspace's group.
  for (var i = 0; i < userData.projects.length; i++) {
    var proj = userData.projects[i];
    var opt = groups[proj.wid].appendChild(createOption(proj.id, proj.cid, proj.name));
    if (proj.id === currentProjectId) {
      opt.selected = 'selected';
    }
  }
  return select;
}

function createProjectSelect(userData, className) {
  var clientName, option,
    select = createTag('select', className);

  //add an empty (default) option
  select.appendChild(createOption("default", null, "Select a toggl project"));

  userData.projects.forEach(function (project) {
    clientName = userData.clients.filter(function (elem, index, array) { return (elem.id === project.cid); })[0].name;
    select.appendChild(createOption(project.id, project.cid, clientName + " - " + project.name));
  });

  return select;
}
