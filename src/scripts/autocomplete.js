/*jslint indent: 2, unparam: true, plusplus: true*/
/*global document: false */
"use strict";

var inheritsFrom = function (child, parent) {
  child.prototype = Object.create(parent.prototype);
  child.prototype.super = parent.prototype;
};

var AutoComplete = function (el, item, elem) {
  this.type = el;
  this.el = document.querySelector("#" + el + "-autocomplete");
  this.filter = document.querySelector("#toggl-button-" + el + "-filter");
  this.filterClear = this.el.parentNode.querySelector(".filter-clear");
  this.placeholderItem = document.querySelector("#toggl-button-" + el + "-placeholder");
  this.placeholderDiv = this.placeholderItem.querySelector("div");
  this.clearSelected = this.el.querySelector("." + el + "-clear");
  this.addLink = this.el.parentNode.querySelector(".add-new-" + el);
  this.elem = elem;
  this.item = item;
  this.lastFilter = "";
  this.listItems = [];
  this.exactMatch = false;

  this.addEvents();
};

AutoComplete.prototype.addEvents = function () {
  var that = this;

  that.placeholderItem.addEventListener('click', function (e) {
    that.filter.focus();
  });

  that.filter.addEventListener('focus', function (e) {
    that.filter.parentNode.classList.add("open");
    that.listItems = that.el.querySelectorAll(that.item);
  });

  that.filter.addEventListener('keydown', function (e) {
    if (e.code === "Tab" || e.code === "Enter") {
      that.closeDropdown();
    }
    if (e.code === "Escape" &&
        that.placeholderItem.parentNode.classList.contains("open")) {
      that.closeDropdown();
      e.stopPropagation();
      e.preventDefault();
    }
  });

  that.filter.addEventListener('keyup', function (e) {
    that.filterSelection();
  });

  that.filterClear.addEventListener('click', function (e) {
    that.closeDropdown();
  });
};

AutoComplete.prototype.clearFilters = function () {
  this.el.classList.remove("filtered");
  var i,
    a = this.el.querySelectorAll(".filter"),
    b = this.el.querySelectorAll(".tasklist-opened");

  for (i = 0; i < a.length; i++) {
    a[i].classList.remove("filter");
  }

  for (i = 0; i < b.length; i++) {
    b[i].classList.remove("tasklist-opened");
  }
};

AutoComplete.prototype.closeDropdown = function (t) {
  var that = t || this;
  that.filter.value = "";
  that.el.classList.remove("filtered");
  that.placeholderItem.parentNode.classList.toggle("open");
  that.placeholderItem.parentNode.classList.remove("add-allowed");
  that.clearFilters();
};

//* Project autocomplete *//

var ProjectAutoComplete = function (el, item, elem) {
  AutoComplete.call(this, el, item, elem);
};

inheritsFrom(ProjectAutoComplete, AutoComplete);

ProjectAutoComplete.prototype.setup = function (selected, tid) {
  this.setSelected(selected, tid);
  this.placeholderDiv.textContent = this.placeholderDiv.title = this.generateLabel(null, selected, this.type, tid);
  this.setProjectBullet(selected, tid);
};

ProjectAutoComplete.prototype.addEvents = function () {
  var that = this;
  this.super.addEvents.call(this);

  that.el.addEventListener('click', function (e) {
    e.stopPropagation();
    that.selectProject(e.target);
  });
};

ProjectAutoComplete.prototype.setSelected = function (ids, tid) {
  var t = this.el.querySelector("li[data-tid='" + tid + "']");
  if (!!t) {
    this.selectTask(t, true);
    return;
  }
  this.setSelectedProject(ids);
};

ProjectAutoComplete.prototype.setSelectedProject = function (ids) {
  var selected = this.el.querySelectorAll(".selected-" + this.type),
    i;

  // Clear previously selected
  if (selected.length >= 1) {
    for (i = 0; i < selected.length; i++) {
      selected[i].classList.remove("selected-" + this.type);
    }
  }

  // Select project
  if (!!ids) {
    this.el.querySelector("li[data-pid='" + ids + "']").classList.add("selected-" + this.type);
  }
};

ProjectAutoComplete.prototype.selectTask = function (elem, silent) {
  // Set selected task
  var currentSelected = this.el.querySelector(".selected-task");

  if (!!currentSelected) {
    currentSelected.classList.remove("selected-task");
  }
  elem.classList.add("selected-task");

  // Set selected project
  this.selectProject(elem.parentNode.parentNode, silent, true);
};

ProjectAutoComplete.prototype.selectProject = function (elem, silent, removeTask) {
  if (elem.classList.contains("item-name")) {
    elem = elem.parentNode;
  }
  if (!elem.classList.contains(this.type + "-row")) {
    if (elem.classList.contains("task-count")) {
      this.toggleTaskList(elem);
    }
    if (elem.classList.contains("task-item")) {
      this.selectTask(elem);
    }
    return;
  }

  if (!removeTask && this.el.querySelector(".selected-task")) {
    this.el.querySelector(".selected-task").classList.remove("selected-task");
  }

  var currentSelected = this.el.querySelector(".selected-" + this.type),
    val = elem.getAttribute("data-pid");

  if (!!currentSelected) {
    currentSelected.classList.remove("selected-" + this.type);
  }
  elem.classList.add("selected-" + this.type);

  // Update placeholder
  this.placeholderDiv.textContent = this.placeholderDiv.title = this.generateLabel(this.getSelected(), val, this.type);
  this.setProjectBullet(val);

  if (!silent) {
    // Close dropdown
    this.closeDropdown();
  }
  return false;
};

ProjectAutoComplete.prototype.toggleTaskList = function (elem) {
  var opened = this.el.querySelector(".tasklist-opened");
  if (!!opened) {
    opened.classList.remove("tasklist-opened");
  }
  if (opened !== elem.parentNode) {
    elem.parentNode.classList.toggle("tasklist-opened");
  }
};

ProjectAutoComplete.prototype.getSelected = function () {
  var selected = this.el.querySelector(".selected-" + this.type),
    task = this.el.querySelector(".selected-task"),
    pid = (!!selected) ? parseInt(selected.getAttribute("data-pid"), 10) : 0,
    tid = (!!task) ? parseInt(task.getAttribute("data-tid"), 10) : null,
    name = (!!selected) ? selected.getAttribute("title") : "";

  return {
    el: selected,
    pid: pid,
    tid: tid,
    name: name
  };
};

ProjectAutoComplete.prototype.getSelectedProjectByPid = function (pid) {
  var selected = this.el.querySelector("li[data-pid='" + pid + "']"),
    name = (!!selected) ? selected.textContent : "";

  return {
    el: selected,
    pid: pid,
    name: name
  };
};

ProjectAutoComplete.prototype.setProjectBullet = function (pid, tid, el) {
  var project,
    elem = el || this.placeholderItem.querySelector(".project-bullet"),
    result,
    task;

  if (!!pid || pid === "0") {
    project = this.el.querySelector("li[data-pid='" + pid + "']");
    if (!!project) {
      elem.className = project.querySelector(".project-bullet").className;
      result = " - " + project.getAttribute("title");
      if (!!tid) {
        task = project.querySelector("li[data-tid='" + tid + "']");
        if (!!task) {
          result += " . " + task.getAttribute("title");
        }
      }
      return result;
    }
  }
  elem.className = "project-bullet";
  return "";
};

ProjectAutoComplete.prototype.generateLabel = function (select, id, type, tid) {
  var selected = false,
    client,
    result = "",
    task;

  select = this.getSelectedProjectByPid(id);

  if (!select) {
    select = this.getSelected();
  }

  if (!!select && !!select.el) {
    selected = select.pid;
    task = select.el.querySelector(".selected-task") || select.el.querySelector("li[data-tid='" + tid + "']");
    if (!!task) {
      result += task.getAttribute("title") + " . ";
    }
    client = select.el.parentNode.querySelector(".client-row");
    if (!!client) {
      result = client.textContent + " - ";
    }
    result += select.el.getAttribute("title");
  }

  if (parseInt(id, 10) === 0 || !selected) {
    return "Add " + type;
  }
  return result;
};

ProjectAutoComplete.prototype.filterSelection = function () {
  var key,
    val = this.filter.value.toLowerCase(),
    row,
    text;

  if (val === this.lastFilter) {
    return;
  }

  if (val.length > 0 && !this.el.classList.contains("filtered")) {
    this.el.classList.add("filtered");
  }
  if (val.length === 0) {
    this.clearFilters();
    return;
  }
  this.lastFilter = val;
  this.exactMatch = false;
  for (key in this.listItems) {
    if (this.listItems.hasOwnProperty(key)) {
      row = this.listItems[key];
      text = row.getAttribute("title").toLowerCase();
      if (text.indexOf(val) !== -1) {
        if (text === val) {
          this.exactMatch = val;
        }
        row.classList.add("filter");

        if (row.classList.contains("project-row")) {
          // row.parentNode refers to ul.client-list
          row.parentNode.classList.add("filter");
          // row.parentNode.parentNode refers to ul.ws-list
          row.parentNode.parentNode.classList.add("filter");
        }
        if (row.classList.contains("client-row")) {
          // row.parentNode refers to ul.client-list
          row.parentNode.classList.add("filter-match");
        }

        if (row.classList.contains("task-item")) {
          // row.parentNode.parentNode refers to li.project-row
          row.parentNode.parentNode.classList.add("filter");
          row.parentNode.parentNode.classList.add("tasklist-opened");
          row.classList.add("filter");
        }

      } else if (!!row.classList) {
        row.classList.remove("filter");

        if (row.classList.contains("task-item")) {
          row.classList.remove("filter");
          if (row.parentNode.querySelectorAll(".filter").length === 0) {
            row.parentNode.parentNode.classList.remove("tasklist-opened");
          }
        } else {
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
  }
};


//* Tag autocomplete *//

var TagAutoComplete = function (el, item, elem) {
  AutoComplete.call(this, el, item, elem);
};

inheritsFrom(TagAutoComplete, AutoComplete);

TagAutoComplete.prototype.setup = function (selected) {
  this.setSelected(selected);
};

TagAutoComplete.prototype.addEvents = function () {
  var that = this;
  this.super.addEvents.call(this);

  this.el.addEventListener('click', function (e) {
    e.stopPropagation();
    that.selectTag(e);
  });

  this.clearSelected.addEventListener('click', function (e) {
    that.clearSelectedTags();
  });

  that.addLink.addEventListener('click', function (e) {
    that.addNew();
  });
};

TagAutoComplete.prototype.closeDropdown = function () {
  this.super.closeDropdown(this, this);
  this.updatePlaceholder();
};

TagAutoComplete.prototype.selectTag = function (e) {
  e.target.classList.toggle("selected-tag");
};

TagAutoComplete.prototype.setSelected = function (tags) {
  var i,
    item;

  this.clearSelectedTags();

  if (!!tags) {
    for (i = 0; i < tags.length; i += 1) {
      item = this.el.querySelector("li[title='" + tags[i] + "']");
      if (!item) {
        this.addNew(tags[i]);
      } else {
        item.classList.add("selected-" + this.type);
      }
    }
  }

  this.updatePlaceholder(tags);
};

TagAutoComplete.prototype.clearSelectedTags = function (tags) {
  var current = this.el.querySelectorAll(".tag-list li.selected-tag"),
    i;

  for (i = 0; i < current.length; i += 1) {
    current[i].classList.remove("selected-tag");
  }
};

TagAutoComplete.prototype.updatePlaceholder = function (tags) {
  if (!tags) {
    tags = this.getSelected();
  }

  if (!!tags && tags.length) {
    tags = tags.join(',');
  } else {
    tags = "Add tags";
  }
  this.placeholderDiv.textContent = this.placeholderDiv.title = tags;
};

TagAutoComplete.prototype.getSelected = function () {
  var tags = [],
    tag,
    i,
    s = this.el.querySelectorAll(".tag-list .selected-tag");
  for (i = 0; i < s.length; i += 1) {
    tag = s[i].textContent;
    tags.push(tag);
  }
  return tags;
};

TagAutoComplete.prototype.filterSelection = function () {
  var key,
    val = this.filter.value.toLowerCase(),
    row,
    text;

  if (val === this.lastFilter) {
    return;
  }

  if (val.length > 0 && !this.el.classList.contains("filtered")) {
    this.el.classList.add("filtered");
  }
  if (val.length === 0) {
    this.clearFilters();
    return;
  }
  this.lastFilter = val;
  this.exactMatch = false;
  for (key in this.listItems) {
    if (this.listItems.hasOwnProperty(key)) {
      row = this.listItems[key];
      text = row.getAttribute("title").toLowerCase();
      if (text.indexOf(val) !== -1) {
        if (text === val) {
          this.exactMatch = val;
        }
        row.classList.add("filter");
      } else if (!!row.classList) {
        row.classList.remove("filter");
      }
    }
  }
  this.updateAddLink();
};

TagAutoComplete.prototype.updateAddLink = function (e) {
  if (!!this.addLink) {
    if (!!this.exactMatch) {
      this.placeholderItem.parentNode.classList.remove("add-allowed");
    } else {
      this.placeholderItem.parentNode.classList.add("add-allowed");
    }
  }
};

TagAutoComplete.prototype.addNew = function (text) {
  var val = text || this.filter.value,
    list = this.el.querySelector("." + this.type + "-list"),
    item = document.createElement("li");

  item.className = this.type + "-item selected-" + this.type;
  item.setAttribute("title", val);
  item.textContent = val;

  list.insertBefore(item, list.querySelector("li:first-child"));
  this.filter.value = "";
  this.filterSelection();
};