/*jslint indent: 2, unparam: true, plusplus: true*/
/*global document: false, window: false, XMLHttpRequest: false, chrome: false, btoa: false, localStorage:false */
"use strict";

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

AutoComplete.prototype.setup = function (selected, tid) {
  if (this.type === "project") {
    this.setSelected(selected, tid);
    this.placeholderDiv.innerHTML = this.placeholderDiv.title = this.generateLabel(null, selected, this.type, tid);
    this.setProjectBullet(selected, tid);
  } else {
    this.setSelectedTags(selected);
  }
};

AutoComplete.prototype.addEvents = function () {
  var that = this;

  that.placeholderItem.addEventListener('click', function (e) {
    that.filter.focus();
  });

  that.filter.addEventListener('focus', function (e) {
    this.parentNode.classList.add("open");
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

  that.el.addEventListener('click', function (e) {
    e.stopPropagation();
    if (that.type === "project") {
      that.selectProject(e.target);
    } else {
      that.selectTag(e);
    }
  });

  if (this.type === "tag") {
    that.clearSelected.addEventListener('click', function (e) {
      that.clearSelectedTags();
    });

    that.addLink.addEventListener('click', function (e) {
      that.addNew();
    });
  }
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

AutoComplete.prototype.filterSelection = function () {
  var key,
    that = this,
    val = that.filter.value.toLowerCase(),
    row,
    text;

  if (val === that.lastFilter) {
    return;
  }

  if (val.length > 0 && !that.el.classList.contains("filtered")) {
    that.el.classList.add("filtered");
  }
  if (val.length === 0) {
    that.clearFilters();
    return;
  }
  that.lastFilter = val;
  that.exactMatch = false;
  for (key in that.listItems) {
    if (that.listItems.hasOwnProperty(key)) {
      row = that.listItems[key];
      text = row.getAttribute("title").toLowerCase();
      if (text.indexOf(val) !== -1) {
        if (text === val) {
          that.exactMatch = val;
        }
        row.classList.add("filter");

        if (that.type === "project") {
          if (row.classList.contains("project-row")) {
            row.parentNode.classList.add("filter");
            row.parentNode.parentNode.classList.add("filter");
          }
          if (row.classList.contains("client-row")) {
            row.parentNode.classList.add("filter-match");
          }

          if (row.classList.contains("task-item")) {
            row.parentNode.parentNode.classList.add("filter");
            row.parentNode.parentNode.classList.add("tasklist-opened");
            row.classList.add("filter");
          }
        }

      } else if (!!row.classList) {
        row.classList.remove("filter");

        if (that.type === "project") {
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
  }
  that.updateAddLink();
};

AutoComplete.prototype.selectTag = function (e) {
  e.target.classList.toggle("selected-tag");
};

AutoComplete.prototype.addNew = function (text) {
  var val = text || this.filter.value,
    list = this.el.querySelector("." + this.type + "-list"),
    item = document.createElement("li");

  item.className = this.type + "-item selected-" + this.type;
  item.setAttribute("title", val);
  item.innerHTML = val;

  list.insertBefore(item, list.querySelector("li:first-child"));
  this.filter.value = "";
  this.filterSelection();
};

AutoComplete.prototype.updateAddLink = function (e) {
  if (!!this.addLink) {
    if (!!this.exactMatch) {
      this.placeholderItem.parentNode.classList.remove("add-allowed");
    } else {
      this.placeholderItem.parentNode.classList.add("add-allowed");
    }
  }
};

AutoComplete.prototype.toggleTaskList = function (elem) {
  var opened = this.el.querySelector(".tasklist-opened");
  if (!!opened) {
    opened.classList.remove("tasklist-opened");
  }
  if (opened !== elem.parentNode) {
    elem.parentNode.classList.toggle("tasklist-opened");
  }
};

AutoComplete.prototype.selectTask = function (elem, silent) {
  // Set selected task
  var currentSelected = this.el.querySelector(".selected-task");

  if (!!currentSelected) {
    currentSelected.classList.remove("selected-task");
  }
  elem.classList.add("selected-task");

  // Set selected project
  this.selectProject(elem.parentNode.parentNode, silent, true);
};

AutoComplete.prototype.selectProject = function (elem, silent, removeTask) {
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
  this.placeholderDiv.innerHTML = this.placeholderDiv.title = this.generateLabel(this.getSelected(), val, this.type);
  this.setProjectBullet(val);

  if (!silent) {
    // Close dropdown
    this.closeDropdown();
  }
  return false;
};

AutoComplete.prototype.closeDropdown = function () {
  this.filter.value = "";
  this.el.classList.remove("filtered");
  this.placeholderItem.parentNode.classList.toggle("open");
  this.placeholderItem.parentNode.classList.remove("add-allowed");

  if (this.type === "tag") {
    this.updatePlaceholder();
  }
  this.clearFilters();
};

AutoComplete.prototype.setSelected = function (ids, tid) {
  if (this.type === "project") {
    var t = this.el.querySelector("li[data-tid='" + tid + "']");
    if (!!t) {
      this.selectTask(t, true);
      return;
    }
    this.setSelectedProject(ids);
  } else {
    this.setSelecedTags(ids);
  }
};

AutoComplete.prototype.setSelectedTags = function (tags) {
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

AutoComplete.prototype.clearSelectedTags = function (tags) {
  var current = this.el.querySelectorAll(".tag-list li.selected-tag"),
    i;

  for (i = 0; i < current.length; i += 1) {
    current[i].classList.remove("selected-tag");
  }
};

AutoComplete.prototype.updatePlaceholder = function (tags) {
  if (!tags) {
    tags = this.getSelectedTags();
  }

  if (!!tags && tags.length) {
    tags = tags.join(',');
  } else {
    tags = "Add tags";
  }
  this.placeholderDiv.innerHTML = this.placeholderDiv.title = tags;
};

AutoComplete.prototype.setSelectedProject = function (ids) {
  var selected = this.el.querySelectorAll(".selected-" + this.type),
    i;

  if (selected.length >= 1) {
    for (i = 0; i < selected.length; i++) {
      selected[i].classList.remove("selected-" + this.type);
    }
  }
  if (!!ids) {
    if (typeof ids === "object") {
      for (i = 0; i < ids.length; i++) {
        this.el.querySelector("li[title='" + ids[i] + "']").classList.add("selected-" + this.type);
      }
    } else {
      if (this.type === "project") {
        this.el.querySelector("li[data-pid='" + ids + "']").classList.add("selected-" + this.type);
      } else {
        this.el.querySelector("li[title='" + ids + "']").classList.add("selected-" + this.type);
      }
    }
  }
};

AutoComplete.prototype.getSelected = function () {
  if (this.type === "project") {
    return this.getSelectedProject();
  }
  return this.getSelectedTags();
};

AutoComplete.prototype.getSelectedTags = function () {
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

AutoComplete.prototype.getSelectedProject = function () {
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

AutoComplete.prototype.getSelectedProjectByPid = function (pid) {
  var selected = this.el.querySelector("li[data-pid='" + pid + "']"),
    name = (!!selected) ? selected.textContent : "";

  return {
    el: selected,
    pid: pid,
    name: name
  };
};

AutoComplete.prototype.setProjectBullet = function (pid, tid, el) {
  var project,
    className,
    id = parseInt(pid, 10),
    elem = el || this.placeholderItem.querySelector(".project-bullet"),
    result,
    task;

  if (!!pid) {
    project = this.el.querySelector("li[data-pid='" + pid + "']");
    if (id !== 0) {
      if (!!project) {
        className = project.querySelector(".project-bullet").className;
        elem.className = className;
        result = " - " + project.getAttribute("title");
        task = project.querySelector("li[data-tid='" + tid + "']");
        if (!!task) {
          result += " . " + task.getAttribute("title");
        }
        return result;
      }
    }
  }
  elem.className = "project-bullet";
  return "";
};

AutoComplete.prototype.generateLabel = function (select, id, type, tid) {
  var selected = false,
    client,
    result = "",
    task;

  if (type === "project") {
    select = this.getSelectedProjectByPid(id);
  }

  if (!select) {
    select = this.getSelected();
  }

  if (type === "project") {
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
  } else {
    selected = select.options[select.selectedIndex];
    result = selected.text;
  }

  if (parseInt(id, 10) === 0 || !selected) {
    return "Add " + type;
  }
  return result;
};