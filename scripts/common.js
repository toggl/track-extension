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

function createGroupedProjectSelect(user, currentProjectId, onChangeFunction) {
  console.log(user);
  var groups = {};
  // Create select.
  var select = createTag('select', 'toggl-project-select');
  select.setAttribute('empty', 'empty');
  select.appendChild(createTag('option', 'meta-option', "none")).value = 'default';
  // Create one optgroup per workspace.
  for (var i = 0; i < user.workspaces.length; i++) {
    groups[user.workspaces[i].id] = select.appendChild(createTag('optgroup'));
    groups[user.workspaces[i].id].label = user.workspaces[i].name;
  }
  // Add the projects to their workspace's group.
  for (var i = 0; i < user.projects.length; i++) {
    var proj = user.projects[i];
    var opt = groups[proj.wid].appendChild(createTag('option', '', proj.name));
    opt.value = proj.id;
    if (proj.id === currentProjectId) {
      opt.selected = 'selected';
      select.removeAttribute('empty');
    }
  }
  // Bind the onchange event to call the provided onChangeFunction.
  select.onchange = function(event) {
    if (select.value == 'default') select.setAttribute('empty', 'empty');
    else select.removeAttribute('empty');
    onChangeFunction(select.value == 'default' ? null : Number(select.value));
  }
  return select;
}

function createOption(id, cid, text) {
  var option = document.createElement("option");
  option.setAttribute("value", id);
  option.setAttribute("data-client-id", cid);
  option.text = text;
  return option;
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
