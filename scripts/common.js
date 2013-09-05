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

function createOption(id, cid, clientName, projectName) {
  var option = document.createElement("option");
  option.setAttribute("value", id);
  option.setAttribute("data-client-id", cid);

  var text = '';
  if (clientName) {
    text = clientName + ' - ';
  }
  option.text = text + projectName;

  if (projectName) {
    option.setAttribute("data-project-name", projectName);
  }
  if (clientName) {
    option.setAttribute("data-client-name", clientName);
  }

  return option;
}

function createProjectSelect(userData, className) {
  var clientName, option,
    select = createTag('select', className);

  //add an empty (default) option
  select.appendChild(createOption("default", null, "Select a toggl project"));

  userData.projects.forEach(function (project) {
    var result = userData.clients.filter(function (elem, index, array) { return (elem.id === project.cid); });
    if (!result.length) {
      clientName = '';
    } else {
      clientName = result[0].name;
    }
    select.appendChild(createOption(project.id, project.cid, clientName, project.name));
  });

  return select;
}
