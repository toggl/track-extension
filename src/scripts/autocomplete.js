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
  this.elem = elem;
  this.item = item;
  this.lastFilter = "";
  this.listItems = [];

  this.addEvents();
};

AutoComplete.prototype.setup = function (selected) {
  if (this.type === "project") {
    this.setSelected(selected);
    this.updateLabel(selected);
    this.setProjectBullet(selected);
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
          if (that.type === "project") {
            if (row.classList.contains("project-row")) {
              row.parentNode.classList.add("filter");
              row.parentNode.parentNode.classList.add("filter");
            }
            if (row.classList.contains("client-row")) {
              row.parentNode.classList.add("filter-match");
            }
          }
        } else if (!!row.classList) {
          row.classList.remove("filter");
          if (that.type === "project") {
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
  });

  that.filterClear.addEventListener('click', function (e) {
    that.closeDropdown();
  });

  that.el.addEventListener('click', function (e) {
    e.stopPropagation();
    if (that.type === "project") {
      that.selectProject(e);
    } else {
      that.selectTag(e);
    }
  });
};

AutoComplete.prototype.selectTag = function (e) {
  e.target.classList.toggle("selected-tag");
};

AutoComplete.prototype.selectProject = function (e) {
  if (!e.target.classList.contains(this.type + "-row")) {
    return;
  }

  var currentSelected = this.el.querySelector(".selected-" + this.type),
    val = e.target.getAttribute("data-pid");

  if (!!currentSelected) {
    currentSelected.classList.remove("selected-" + this.type);
  }
  e.target.classList.add("selected-" + this.type);

  // Update placeholder
  this.placeholderDiv.innerHTML = this.placeholderDiv.title = this.generateLabel(this.getSelected(), val, this.type);
  this.setProjectBullet(val);
  this.elem.fetchTasks(val);

  // Close dropdown
  this.closeDropdown();
  return false;
};

AutoComplete.prototype.closeDropdown = function () {
  this.filter.value = "";
  this.el.classList.remove("filtered");
  this.placeholderItem.parentNode.classList.toggle("open");

  if (this.type === "tag") {
    this.updatePlaceholder();
  }
};

AutoComplete.prototype.setSelected = function (ids) {
  if (this.type === "project") {
    this.setSelectedProject(ids);
  } else {
    this.setSelecedTags(ids);
  }
};

AutoComplete.prototype.setSelectedTags = function (tags) {
  var i;

  this.clearSelectedTags();

  if (!!tags) {
    for (i = 0; i < tags.length; i += 1) {
      this.el.querySelector("li[title='" + tags[i] + "']").classList.add("selected-" + this.type);
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
    pid = (!!selected) ? parseInt(selected.getAttribute("data-pid"), 10) : 0,
    name = (!!selected) ? selected.textContent : "";

  return {
    el: selected,
    pid: pid,
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

AutoComplete.prototype.setProjectBullet = function (pid, el) {
  var project,
    className,
    id = parseInt(pid, 10),
    elem = el || this.placeholderItem.querySelector(".project-bullet");

  if (!!pid) {
    project = this.el.querySelector("li[data-pid='" + pid + "']");
    if (id !== 0) {
      if (!!project) {
        className = project.querySelector(".project-bullet").className;
        elem.className = className;
        return " - " + project.textContent;
      }
    }
  }
  elem.className = "project-bullet";
  return "";
};

AutoComplete.prototype.updateLabel = function (pid) {
  this.placeholderDiv.innerHTML = this.placeholderDiv.title = this.generateLabel(null, pid, this.type);
};

AutoComplete.prototype.generateLabel = function (select, id, type) {
  var selected = false,
    client,
    result = "";

  if (type === "project") {
    select = this.getSelectedProjectByPid(id);
  }

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