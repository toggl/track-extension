/*jslint indent: 2 */
/*global document: false */
"use strict";

function $(s, elem) {
  elem = elem || document;
  return elem.querySelector(s);
}

function createTag(name, className) {
  var tag = document.createElement(name);
  tag.className = className;
  return tag;
}

function createLink(className) {
  var link = createTag('a', className);
  link.href = '#';
  link.appendChild(document.createTextNode('Start timer'));
  return link;
}
