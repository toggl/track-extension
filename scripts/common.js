/*jslint indent: 2 */
/*global document: false */
"use strict";

function $(s, elem) {
  elem = elem || document;
  return elem.querySelector(s);
}

function createTag(name, className, child) {
  var tag = document.createElement(name);
  tag.className = className;
  
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
