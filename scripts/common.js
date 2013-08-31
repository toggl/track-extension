/*jslint indent: 2 */
/*global document: false */
"use strict";

function $(s, elem) {
  elem = elem || document;
  return elem.querySelector(s);
}

function createTag(name, className, innerHTML) {
  var tag = document.createElement(name);
  tag.className = className;

  if (innerHTML) {
    tag.innerHTML = innerHTML;
  }

  return tag;
}

function createLink(className, tagName, linkHref) {
  var link;

  // Param defaults
  tagName  = tagName  || 'a';
  linkHref = linkHref || '#';
  link     = createTag(tagName, className);

  if (tagName == 'a') {
    link.href = '#';
  }

  link.appendChild(document.createTextNode('Start timer'));
  return link;
}

function createOption(id, cid, text, isSelected) {
  var option = document.createElement("option");
  option.setAttribute("value", id);
  option.setAttribute("data-client-id", cid);
  if (isSelected) option.setAttribute("selected", isSelected);
  option.text = text;
  return option;
}

function createProjectSelect(userData, className, projectName) {
  var clientName, option,
    select = createTag('select', className);

  //add an empty (default) option
  select.appendChild(createOption("default", null, "Select a Toggl project"));

  userData.projects.forEach(function (project) {
    var client = userData.$clientMap[project.cid];
    clientName = client ? client.name : "?";
    select.appendChild(createOption(project.id, project.cid, clientName + " - " + project.name, project.name == projectName));
  });

  return select;
}

