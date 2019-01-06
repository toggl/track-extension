var noop = function() {
  return undefined;
};

var inheritsFrom = function(child, parent) {
  child.prototype = Object.create(parent.prototype);
  child.prototype.super = parent.prototype;
};

var AutoComplete = function(el, item, elem) {
  this.type = el;
  this.el = document.querySelector('#' + el + '-autocomplete');
  this.filter = document.querySelector('#toggl-button-' + el + '-filter');
  this.filterClear = this.el.parentNode.querySelector('.filter-clear');
  this.placeholderItem = document.querySelector(
    '#toggl-button-' + el + '-placeholder'
  );
  this.placeholderDiv = this.placeholderItem.querySelector('div');
  this.clearSelected = this.el.querySelector('.' + el + '-clear');
  this.addLink = this.el.parentNode.querySelector('.add-new-' + el);
  this.elem = elem;
  this.item = item;
  this.lastFilter = '';
  this.listItems = [];
  this.exactMatch = false;

  this.addEvents();
};

AutoComplete.prototype.addEvents = function() {
  var that = this;

  that.placeholderItem.addEventListener('click', function(e) {
    setTimeout(function() {
      that.filter.focus();
    }, 50);
  });

  window.addEventListener(
    'focus',
    function(e) {
      if (e.target === that.filter) {
        that.openDropdown();
      }
    },
    true
  );

  that.filter.addEventListener('keydown', function(e) {
    if (e.code === 'Tab') {
      that.closeDropdown();
    }
    if (e.code === 'Enter') {
      if (
        that.filter.parentNode.classList.contains('open') &&
        !!that.saveSelected
      ) {
        that.saveSelected();
        e.stopPropagation();
        e.preventDefault();
      }
      that.closeDropdown();
    }
    if (
      e.code === 'Escape' &&
      that.placeholderItem.parentNode.classList.contains('open')
    ) {
      that.closeDropdown();
      e.stopPropagation();
      e.preventDefault();
    }
  });

  that.filter.addEventListener('keyup', function(e) {
    that.filterSelection();
  });

  that.filterClear.addEventListener('click', function(e) {
    that.closeDropdown();
    e.preventDefault();
  });
};

AutoComplete.prototype.clearFilters = function() {
  this.el.classList.remove('filtered');
  var i,
    a = this.el.querySelectorAll('.filter'),
    b = this.el.querySelectorAll('.tasklist-opened');

  for (i = 0; i < a.length; i++) {
    a[i].classList.remove('filter');
  }

  for (i = 0; i < b.length; i++) {
    b[i].classList.remove('tasklist-opened');
  }
};

AutoComplete.prototype.openDropdown = function() {
  this.filter.parentNode.classList.add('open');
  this.listItems = this.el.querySelectorAll(this.item);
  this.visibleItems = this.el.querySelectorAll('.' + this.type + '-row');
  this.updateHeight();
};

AutoComplete.prototype.closeDropdown = function(t) {
  var that = t || this;
  that.filter.value = '';
  that.el.classList.remove('filtered');
  that.placeholderItem.parentNode.classList.remove('open');
  that.placeholderItem.parentNode.classList.remove('add-allowed');
  that.clearFilters();
};

AutoComplete.prototype.updateHeight = function() {
  var bodyRect = document.body.getBoundingClientRect(),
    elRect = this.el.getBoundingClientRect(),
    style = 'max-height:auto;',
    listStyle = 'max-height:auto;',
    calc;

  if (bodyRect.bottom > 0 && elRect.bottom + 25 >= bodyRect.bottom) {
    calc = window.scrollY + bodyRect.bottom - elRect.top - 10;
    if (calc < 55) {
      calc = 55;
    }
    style = 'max-height: ' + calc + 'px;';
    listStyle = 'max-height: ' + (calc - 25) + 'px;';
  }

  this.el.style = style;
  if (this.type === 'tag') {
    document.querySelector('.tag-list').style = listStyle;
  }
};

//* Project autocomplete *//

export var ProjectAutoComplete = function(el, item, elem) {
  AutoComplete.call(this, el, item, elem);
  this.onChangeHandler = noop;
  this.selectedItem = -1;
  this.selectedTask = -1;
  this.visibleItems = [];
  this.visibleTasks = [];
};

inheritsFrom(ProjectAutoComplete, AutoComplete);

ProjectAutoComplete.prototype.setup = function(selected, tid) {
  this.setSelected(selected, tid);
  this.placeholderDiv.textContent = this.placeholderDiv.title = this.generateLabel(
    null,
    selected,
    this.type,
    tid
  );
  this.setProjectBullet(selected, tid);
};

ProjectAutoComplete.prototype.addEvents = function() {
  var that = this,
    item;

  this.super.addEvents.call(this);

  that.el.addEventListener('click', function(e) {
    e.stopPropagation();
    that.selectProject(e.target);
  });

  that.filter.addEventListener('keydown', function(e) {
    if (e.keyCode === 38) {
      // ArrowUp
      that.selectPrevious();
    } else if (e.keyCode === 40) {
      // ArrowDown
      that.selectNext();
    } else if (e.keyCode === 37 || e.keyCode === 39) {
      // Arrow Left/Right (toggle task list)
      item = that.visibleItems[that.selectedItem];
      if (!!item.querySelector('.task-count')) {
        that.clearSelectedTask();
        that.toggleTaskList(item.querySelector('.task-count'));
      }
    }
  });
};

ProjectAutoComplete.prototype.clearSelectedItem = function() {
  var current = this.el.querySelector('.selected-item');
  if (!!current) {
    current.classList.remove('selected-item');
  }
};

ProjectAutoComplete.prototype.clearSelectedTask = function() {
  var current = this.el.querySelector('.task-item.selected-item');
  if (!!current) {
    current.classList.remove('selected-item');
  }
};

ProjectAutoComplete.prototype.selectPrevious = function() {
  if (this.selectedItem === -1) {
    return;
  }
  // handle being inside task list
  if (
    this.selectedTask !== -1 &&
    this.visibleItems[this.selectedItem].classList.contains('tasklist-opened')
  ) {
    this.clearSelectedTask();
    if (this.selectedTask > 0) {
      this.selectedTask--;
      this.visibleTasks[this.selectedTask].classList.add('selected-item');
      this.scrollUpToView(this.el, this.visibleTasks[this.selectedTask]);
      return;
    }
  }

  this.clearSelectedItem();
  if (this.selectedItem > 0) {
    this.selectedItem--;
  } else {
    this.selectedItem = this.visibleItems.length - 1;
  }
  this.visibleItems[this.selectedItem].classList.add('selected-item');
  // detect if we need to scroll
  if (this.selectedItem === this.visibleItems.length - 1) {
    this.visibleItems[this.selectedItem].scrollIntoView(false);
  }
  this.scrollUpToView(this.el, this.visibleItems[this.selectedItem]);

  // If we are entering item with open tasklist
  if (
    this.visibleItems[this.selectedItem].classList.contains('tasklist-opened')
  ) {
    if (this.visibleTasks.length === 0) {
      this.visibleTasks = this.visibleItems[this.selectedItem].querySelectorAll(
        'li.task-item'
      );
    }
    this.selectedTask = this.visibleTasks.length - 1;
    this.visibleTasks[this.selectedTask].classList.add('selected-item');
    this.scrollUpToView(this.el, this.visibleTasks[this.selectedTask]);
  }
};

ProjectAutoComplete.prototype.selectNext = function() {
  // Check if we need to go into tasks-list
  if (
    this.selectedItem !== -1 &&
    this.visibleItems[this.selectedItem].classList.contains('tasklist-opened')
  ) {
    if (this.visibleTasks.length === 0) {
      this.selectedTask = 0;
      this.visibleTasks = this.visibleItems[this.selectedItem].querySelectorAll(
        'li.task-item'
      );
      this.visibleTasks[this.selectedTask].classList.add('selected-item');
      this.scrollDownToView(this.el, this.visibleTasks[this.selectedTask]);
      return;
    }

    this.clearSelectedTask();
    if (this.selectedTask < this.visibleTasks.length - 1) {
      this.selectedTask++;
      this.visibleTasks[this.selectedTask].classList.add('selected-item');
      this.scrollDownToView(this.el, this.visibleTasks[this.selectedTask]);
      return;
    }
  }
  this.selectedTask = -1;
  this.visibleTasks = [];

  this.clearSelectedItem();
  if (this.selectedItem < this.visibleItems.length - 1) {
    this.selectedItem++;
  } else {
    this.selectedItem = 0;
  }
  this.visibleItems[this.selectedItem].classList.add('selected-item');
  // detect if we need to scroll
  if (this.selectedItem === 0) {
    this.visibleItems[this.selectedItem].scrollIntoView();
  }
  this.scrollDownToView(this.el, this.visibleItems[this.selectedItem]);
};

ProjectAutoComplete.prototype.scrollDownToView = function(view, item) {
  if (view.scrollTop + view.offsetHeight < item.offsetTop + item.offsetHeight) {
    item.scrollIntoView(false);
  }
};

ProjectAutoComplete.prototype.scrollUpToView = function(view, item) {
  if (view.scrollTop > item.offsetTop) {
    item.scrollIntoView();
  }
};

ProjectAutoComplete.prototype.saveSelected = function() {
  if (!!this.visibleTasks[this.selectedTask]) {
    this.selectTask(this.visibleTasks[this.selectedTask]);
  } else if (!!this.visibleItems[this.selectedItem]) {
    this.selectProject(this.visibleItems[this.selectedItem]);
  }
  this.closeDropdown();
};

ProjectAutoComplete.prototype.setSelected = function(ids, tid) {
  var t = this.el.querySelector("li[data-tid='" + tid + "']");
  if (!!t) {
    this.selectTask(t, true);
    return;
  }
  this.setSelectedProject(ids);
};

ProjectAutoComplete.prototype.setSelectedProject = function(ids) {
  var selected = this.el.querySelectorAll('.selected-' + this.type),
    i;

  // Clear previously selected
  if (selected.length >= 1) {
    for (i = 0; i < selected.length; i++) {
      selected[i].classList.remove('selected-' + this.type);
    }
  }

  // Select project
  if (!!ids) {
    this.el
      .querySelector("li[data-pid='" + ids + "']")
      .classList.add('selected-' + this.type);
  }
};

ProjectAutoComplete.prototype.selectTask = function(elem, silent) {
  // Set selected task
  var currentSelected = this.el.querySelector('.selected-task');

  if (!!currentSelected) {
    currentSelected.classList.remove('selected-task');
  }
  elem.classList.add('selected-task');

  // Set selected project
  this.selectProject(elem.parentNode.parentNode, silent, true);
};

ProjectAutoComplete.prototype.selectProject = function(
  elem,
  silent,
  removeTask
) {
  if (elem.classList.contains('item-name')) {
    elem = elem.parentNode;
  }
  if (!elem.classList.contains(this.type + '-row')) {
    if (elem.classList.contains('task-count')) {
      this.toggleTaskList(elem);
    }
    if (elem.classList.contains('task-item')) {
      this.selectTask(elem);
    }
    this.onChangeHandler(this.getSelected());
    return;
  }

  if (!removeTask && this.el.querySelector('.selected-task')) {
    this.el.querySelector('.selected-task').classList.remove('selected-task');
  }

  var currentSelected = this.el.querySelector('.selected-' + this.type),
    val = elem.getAttribute('data-pid');

  if (!!currentSelected) {
    currentSelected.classList.remove('selected-' + this.type);
  }
  elem.classList.add('selected-' + this.type);

  // Update placeholder
  this.placeholderDiv.textContent = this.placeholderDiv.title = this.generateLabel(
    this.getSelected(),
    val,
    this.type
  );
  this.setProjectBullet(val);

  if (!silent) {
    // Close dropdown
    this.closeDropdown();
  }

  this.elem.updateBillable(parseInt(val, 10));
  this.onChangeHandler(this.getSelected());
  return false;
};

ProjectAutoComplete.prototype.toggleTaskList = function(elem) {
  var opened = this.el.querySelector('.tasklist-opened');
  if (!!opened) {
    opened.classList.remove('tasklist-opened');
  }
  if (opened !== elem.parentNode) {
    elem.parentNode.classList.toggle('tasklist-opened');
  }
};

ProjectAutoComplete.prototype.getSelected = function() {
  var selected = this.el.querySelector('.selected-' + this.type),
    task = this.el.querySelector('.selected-task'),
    pid = !!selected ? parseInt(selected.getAttribute('data-pid'), 10) : 0,
    tid = !!task ? parseInt(task.getAttribute('data-tid'), 10) : null,
    name = !!selected ? selected.getAttribute('title') : '';

  return {
    el: selected,
    pid: pid,
    tid: tid,
    name: name
  };
};

ProjectAutoComplete.prototype.getSelectedProjectByPid = function(pid) {
  var selected = this.el.querySelector("li[data-pid='" + pid + "']"),
    name = !!selected ? selected.textContent : '';

  return {
    el: selected,
    pid: pid,
    name: name
  };
};

ProjectAutoComplete.prototype.setProjectBullet = function(pid, tid, el) {
  var project,
    elem = el || this.placeholderItem.querySelector('.tb-project-bullet'),
    result,
    task;

  if (!!pid || pid === '0') {
    project = this.el.querySelector("li[data-pid='" + pid + "']");
    if (!!project) {
      elem.className = project.querySelector('.tb-project-bullet').className;
      elem.setAttribute(
        'style',
        project.querySelector('.tb-project-bullet').getAttribute('style')
      );
      result = ' - ' + project.getAttribute('title');
      if (!!tid) {
        task = project.querySelector("li[data-tid='" + tid + "']");
        if (!!task) {
          result += ' . ' + task.getAttribute('title');
        }
      }
      return result;
    }
  }
  elem.className = 'tb-project-bullet';
  return '';
};

ProjectAutoComplete.prototype.generateLabel = function(select, id, type, tid) {
  var selected = false,
    client,
    result = '',
    task;

  select = this.getSelectedProjectByPid(id);

  if (!select) {
    select = this.getSelected();
  }

  if (!!select && !!select.el) {
    selected = select.pid;
    task =
      select.el.querySelector('.selected-task') ||
      select.el.querySelector("li[data-tid='" + tid + "']");
    if (!!task) {
      result += task.getAttribute('title') + ' . ';
    }
    client = select.el.parentNode.querySelector('.client-row');
    if (!!client) {
      result = client.textContent + ' - ';
    }
    result += select.el.getAttribute('title');
  }

  if (parseInt(id, 10) === 0 || !selected) {
    return 'Add ' + type;
  }
  return result;
};

ProjectAutoComplete.prototype.filterSelection = function() {
  var key,
    val = this.filter.value.toLowerCase(),
    row,
    text;

  this.updateHeight();
  if (val === this.lastFilter) {
    return;
  }

  if (val.length > 0 && !this.el.classList.contains('filtered')) {
    this.el.classList.add('filtered');
  }
  if (val.length === 0) {
    this.clearFilters();
    return;
  }
  this.visibleItems = [this.el.querySelector('p.' + this.type + '-row')];
  this.lastFilter = val;
  this.exactMatch = false;
  for (key in this.listItems) {
    if (this.listItems.hasOwnProperty(key)) {
      row = this.listItems[key];
      text = row.getAttribute('title').toLowerCase();
      if (text.indexOf(val) !== -1) {
        if (text === val) {
          this.exactMatch = val;
        }
        this.visibleItems.push(row);
        row.classList.add('filter');

        if (row.classList.contains('project-row')) {
          // row.parentNode refers to ul.client-list
          row.parentNode.classList.add('filter');
          // row.parentNode.parentNode refers to ul.ws-list
          row.parentNode.parentNode.classList.add('filter');
        }
        if (row.classList.contains('client-row')) {
          // row.parentNode refers to ul.client-list
          row.parentNode.classList.add('filter-match');
        }

        if (row.classList.contains('task-item')) {
          // row.parentNode.parentNode refers to li.project-row
          row.parentNode.parentNode.classList.add('filter');
          row.parentNode.parentNode.classList.add('tasklist-opened');
          row.classList.add('filter');
        }
      } else if (!!row.classList) {
        row.classList.remove('filter');

        if (row.classList.contains('task-item')) {
          row.classList.remove('filter');
          if (row.parentNode.querySelectorAll('.filter').length === 0) {
            row.parentNode.parentNode.classList.remove('tasklist-opened');
          }
        } else {
          if (row.parentNode.querySelectorAll('.filter').length === 0) {
            row.parentNode.classList.remove('filter');
          }
          if (
            row.parentNode.parentNode.querySelectorAll('.filter').length === 0
          ) {
            row.parentNode.parentNode.classList.remove('filter');
          }
          if (row.classList.contains('client-row')) {
            row.classList.remove('filter-match');
            row.parentNode.classList.remove('filter-match');
            row.parentNode.parentNode.classList.remove('filter-match');
          }
        }
      }
    }
  }
  this.updateHeight();
};

ProjectAutoComplete.prototype.closeDropdown = function() {
  this.super.closeDropdown(this, this);
  this.clearSelectedItem();
  this.selectedItem = -1;
};

ProjectAutoComplete.prototype.onChange = function(callback) {
  this.onChangeHandler = callback;
};

ProjectAutoComplete.prototype.removeChangeHandler = function() {
  this.onChangeHandler = noop;
};

//* Tag autocomplete *//

export var TagAutoComplete = function(el, item, elem) {
  AutoComplete.call(this, el, item, elem);
  this.wid = null;
};

inheritsFrom(TagAutoComplete, AutoComplete);

TagAutoComplete.prototype.setup = function(selected, wid) {
  this.setSelected(selected);
  this.setWorkspaceId(wid);
};

TagAutoComplete.prototype.addEvents = function() {
  var that = this;
  this.super.addEvents.call(this);

  this.el.addEventListener('click', function(e) {
    e.stopPropagation();
    that.selectTag(e);
  });

  this.clearSelected.addEventListener('click', function(e) {
    that.clearSelectedTags();
  });

  that.addLink.addEventListener('click', function(e) {
    that.addNew();
  });
};

TagAutoComplete.prototype.closeDropdown = function() {
  this.super.closeDropdown(this, this);
  this.updatePlaceholder();
};

TagAutoComplete.prototype.selectTag = function(e) {
  e.target.classList.toggle('selected-tag');
};

TagAutoComplete.prototype.setSelected = function(tags) {
  var i, item;

  this.clearSelectedTags();

  if (!!tags) {
    for (i = 0; i < tags.length; i += 1) {
      item = this.el.querySelector("li[title='" + tags[i] + "']");
      if (!item) {
        this.addNew(tags[i]);
      } else {
        item.classList.add('selected-' + this.type);
      }
    }
  }

  this.updatePlaceholder(tags);
};

TagAutoComplete.prototype.setWorkspaceId = function(wid) {
  this.wid = wid;
  var listItems = this.el.querySelectorAll(this.item),
    stringWid = wid.toString(),
    tag,
    key;

  for (key in listItems) {
    if (listItems.hasOwnProperty(key)) {
      tag = listItems[key];
      if (tag.dataset.wid === stringWid || stringWid === 'nowid') {
        tag.classList.remove('workspace-filter');
      } else {
        tag.classList.add('workspace-filter');
      }
    }
  }
};

TagAutoComplete.prototype.clearSelectedTags = function(tags) {
  var current = this.el.querySelectorAll('.tag-list li.selected-tag'),
    i;

  for (i = 0; i < current.length; i += 1) {
    current[i].classList.remove('selected-tag');
  }
};

TagAutoComplete.prototype.updatePlaceholder = function(tags) {
  if (!tags) {
    tags = this.getSelected();
  }

  if (!!tags && tags.length) {
    tags = tags.join(',');
  } else {
    tags = 'Add tags';
  }
  this.placeholderDiv.textContent = this.placeholderDiv.title = tags;
};

TagAutoComplete.prototype.getSelected = function() {
  var tags = [],
    tag,
    i,
    s = this.el.querySelectorAll('.tag-list .selected-tag');
  for (i = 0; i < s.length; i += 1) {
    tag = s[i].textContent;
    tags.push(tag);
  }
  return tags;
};

TagAutoComplete.prototype.filterSelection = function() {
  var key,
    val = this.filter.value.toLowerCase(),
    row,
    text;

  if (val === this.lastFilter) {
    return;
  }

  if (val.length > 0 && !this.el.classList.contains('filtered')) {
    this.el.classList.add('filtered');
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
      text = row.getAttribute('title').toLowerCase();
      if (text.indexOf(val) !== -1) {
        if (text === val) {
          this.exactMatch = val;
        }
        row.classList.add('filter');
      } else if (!!row.classList) {
        row.classList.remove('filter');
      }
    }
  }
  this.updateAddLink();
};

TagAutoComplete.prototype.updateAddLink = function(e) {
  if (!!this.addLink) {
    if (!!this.exactMatch) {
      this.placeholderItem.parentNode.classList.remove('add-allowed');
    } else {
      this.placeholderItem.parentNode.classList.add('add-allowed');
    }
  }
};

TagAutoComplete.prototype.addNew = function(text) {
  var val = text || this.filter.value,
    list = this.el.querySelector('.' + this.type + '-list'),
    item = document.createElement('li');

  item.className = this.type + '-item selected-' + this.type;
  item.setAttribute('title', val);
  item.textContent = val;

  list.insertBefore(item, list.querySelector('li:first-child'));
  this.filter.value = '';
  this.filterSelection();
};
