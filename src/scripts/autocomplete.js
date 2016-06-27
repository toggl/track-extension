/*jslint indent: 2, unparam: true*/
/*global document: false, window: false, XMLHttpRequest: false, chrome: false, btoa: false, localStorage:false */
"use strict";

var AutoComplete = function (el, item, elem) {
  this.type = el;
  this.el = document.querySelector("#" + el + "-autocomplete");
  this.filter = document.querySelector("#toggl-button-project-filter");
  this.filterClear = document.querySelector("#filter-clear");
  this.placeholderItem = document.querySelector("#toggl-button-" + this.type + "-placeholder");

  this.elem = elem;
  this.item = item;
  this.lastFilter = "";
  this.listItems = [];

  this.addEvents();
};

AutoComplete.prototype.addEvents = function () {
  var that = this;

  that.placeholderItem.addEventListener('click', function (e) {
    this.parentNode.classList.toggle("open");
    that.filter.focus();
  });

  that.filter.addEventListener('focus', function (e) {
    that.listItems = that.el.querySelectorAll(that.item);
    if (!this.parentNode.classList.contains("open")) {
      this.parentNode.classList.toggle("open");
    }
  });

  that.filter.addEventListener('blur', function (e) {
    that.closeDropdown();
  });

  that.filter.addEventListener('keyup', function (e) {
    var key,
      val = that.filter.value.toLowerCase(),
      row;

    if (val === that.lastFilter) {
      return;
    }

    if (val.length > 0 && !that.el.classList.contains("filtered")) {
      that.el.classList.add("filtered");
    }
    if (val.length === 0) {
      that.el.classList.remove("filtered");
    }
    that.lastFilter = val;
    for (key in that.listItems) {
      if (that.listItems.hasOwnProperty(key)) {
        row = that.listItems[key];
        if (row.textContent.toLowerCase().indexOf(val) !== -1) {
          row.classList.add("filter");
          if (row.classList.contains("project-row")) {
            row.parentNode.classList.add("filter");
            row.parentNode.parentNode.classList.add("filter");
          }
          if (row.classList.contains("client-row")) {
            row.parentNode.classList.add("filter-match");
          }
        } else if (!!row.classList) {
          row.classList.remove("filter");
          if (row.parentNode.querySelectorAll(".filter").length === 0) {
            row.parentNode.classList.remove("filter");
          }
          if (row.parentNode.parentNode.querySelectorAll(".filter").length === 0) {
            row.parentNode.parentNode.classList.remove("filter");
          }
          if (row.classList.contains("client-row")) {
            row.classList.remove("filter-match");
            row.parentNode.classList.remove("filter-match");
            row.parentNode.parentNode.classList.remove("filter-match");
          }
        }
      }
    }
  });

  that.filterClear.addEventListener('click', function (e) {
    that.closeDropdown();
  });

  that.el.addEventListener('click', function (e) {
    if (!e.target.classList.contains(that.type + "-row")) {
      return;
    }
    e.stopPropagation();
    var currentSelected = document.querySelector(".selected-project"),
      val = e.target.getAttribute("data-pid"),
      placeholder = document.querySelector("#toggl-button-" + that.type + "-placeholder > div");

    if (!!currentSelected) {
      currentSelected.classList.remove("selected-project");
    }
    e.target.classList.add("selected-project");

    // Update placeholder
    placeholder.innerHTML = placeholder.title = that.generateLabel(that.getSelected(), val, that.type);
    that.setProjectBullet(val, document.querySelector("#toggl-button-" + that.type + "-placeholder > .project-bullet"));
    that.elem.fetchTasks(val);

    // Close dropdown
    that.filter.value = "";
    that.el.classList.remove("filtered");
    that.filterClear.parentNode.classList.toggle("open");
    return false;
  });
};

AutoComplete.prototype.closeDropdown = function () {
  this.filter.value = "";
  this.el.classList.remove("filtered");
  this.placeholderItem.parentNode.classList.toggle("open");
};

AutoComplete.prototype.setSelected = function (pid) {
  var selected = this.el.querySelector(".selected-project");

  if (!!selected) {
    selected.classList.remove("selected-project");
  }
  if (!!pid) {
    this.el.querySelector("li[data-pid='" + pid + "']").classList.add("selected-project");
  }
};

AutoComplete.prototype.getSelected = function () {
  var selected = this.el.querySelector(".selected-project"),
    pid = (!!selected) ? parseInt(selected.getAttribute("data-pid"), 10) : 0,
    name = (!!selected) ? selected.textContent : "";

  return {
    el: selected,
    pid: pid,
    name: name
  };
};

AutoComplete.prototype.setProjectBullet = function (pid, elem) {
  var project,
    className,
    id = parseInt(pid, 10);

  if (!!pid) {
    project = this.el.querySelector("li[data-pid='" + pid + "']");
    if (id !== 0) {
      if (!!project) {
        className = project.querySelector(".project-bullet").className;
        elem.className = className;
        return " - " + project.name;
      }
    }
  }
  elem.className = "project-bullet";
  return "";
};

AutoComplete.prototype.generateLabel = function (select, id, type) {
  var selected = false,
    client,
    result = "";

  if (!select) {
    select = this.getSelected();
  }

  if (type === "project") {
    if (!!select && !!select.el) {
      selected = select.pid;
      client = select.el.parentNode.querySelector(".client-row");
      if (!!client) {
        result = client.textContent + " - ";
      }
      result += select.el.textContent;
    }
  } else {
    selected = select.options[select.selectedIndex];
    result = selected.text;
  }

  if (parseInt(id, 10) === 0 || !selected) {
    return "Add " + type;
  }
  return result;
};