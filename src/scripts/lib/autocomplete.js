const noop = function () {
  return undefined;
};

const inheritsFrom = function (child, parent) {
  child.prototype = Object.create(parent.prototype);
  child.prototype.super = parent.prototype;
};

const AutoComplete = function (el, item, elem) {
  this.type = el;
  this.el = document.querySelector('#' + el + '-autocomplete');
  this.content = this.el.parentElement;
  this.filter = document.querySelector('#toggl-button-' + el + '-filter');
  this.field = this.el.closest('.TB__Dialog__field');
  this.overlay = this.field.querySelector('.TB__Popdown__overlay');
  this.placeholderItem = document.querySelector(
    '#toggl-button-' + el + '-placeholder'
  );
  this.placeholderDiv = this.placeholderItem.querySelector('div');
  this.clearSelected = this.field.querySelector('.' + el + '-clear');
  this.addLink = this.field.querySelector('.add-new-' + el);
  this.elem = elem;
  this.item = item;
  this.lastFilter = '';
  this.listItems = [];
  this.exactMatch = false;

  this.addEvents();
};

AutoComplete.prototype.addEvents = function () {
  const that = this;

  const bindedToggleDropdown = that.toggleDropdown.bind(that);

  this.field.addEventListener('focus', function (e) {
    that.openDropdown();

    setTimeout(() => {
      that.placeholderItem.addEventListener('click', bindedToggleDropdown);
    }, 150);
  });

  this.field.addEventListener('focusout', function (e) {
    if (that.field.contains(e.relatedTarget)) return;
    that.placeholderItem.removeEventListener('click', bindedToggleDropdown);
    that.closeDropdown();
  });

  that.filter.addEventListener('keydown', function (e) {
    if (e.code === 'Tab') {
      that.closeDropdown();
    }
    if (e.code === 'Enter') {
      if (
        that.field.classList.contains('open') &&
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
      that.field.classList.contains('open')
    ) {
      that.closeDropdown();
      e.stopPropagation();
      e.preventDefault();
    }
  });

  that.filter.addEventListener('keyup', function (e) {
    that.filterSelection();
  });

  that.overlay.addEventListener('click', function (e) {
    if (!that.content.contains(e.target) && !that.placeholderItem.contains(e.target)) {
      e.stopPropagation();
      that.closeDropdown();
    }
  });
};

AutoComplete.prototype.clearFilters = function () {
  this.el.classList.remove('filtered');
  let i;

  const a = this.el.querySelectorAll('.filter');

  const b = this.el.querySelectorAll('.tasklist-opened');

  for (i = 0; i < a.length; i++) {
    a[i].classList.remove('filter');
  }

  for (i = 0; i < b.length; i++) {
    b[i].classList.remove('tasklist-opened');
  }

  this.updateAddLink && this.updateAddLink();
};

AutoComplete.prototype.toggleDropdown = function () {
  if (this.field.classList.contains('open')) {
    this.closeDropdown();
  } else {
    this.openDropdown();
  }
};

AutoComplete.prototype.openDropdown = function () {
  if (this.field.classList.contains('open')) {
    return;
  }
  this.field.classList.toggle('open', true);
  // Avoid trapping focus inside the dropdown field while tabbing around
  this.field.setAttribute('tabindex', '-1');
  this.filter.focus();
  this.listItems = this.el.querySelectorAll(this.item);
  this.visibleItems = this.el.querySelectorAll('.' + this.type + '-row');
  this.updateHeight();
};

AutoComplete.prototype.closeDropdown = function (t) {
  const that = t || this;
  that.filter.value = '';
  that.el.classList.remove('filtered');
  that.field.classList.toggle('open', false);
  if (that.addLink) that.addLink.parentNode.classList.remove('add-allowed');
  that.clearFilters();

  // Delay enabling of tabbing again to avoid trapping focus inside this dropdown
  // completely when using SHIFT+TAB.
  setTimeout(() => that.field.setAttribute('tabindex', '0'));
};

AutoComplete.prototype.updateHeight = function () {
  const bodyRect = document.body.getBoundingClientRect();
  const elRect = this.el.getBoundingClientRect();
  let popdownStyle = '';
  let listStyle = 'max-height:auto;';
  let calc;

  if (bodyRect.bottom > 0 && elRect.bottom + 25 >= bodyRect.bottom) {
    calc = window.scrollY + bodyRect.bottom - elRect.top - 10;
    if (calc < 55) {
      calc = 55;
    }
    popdownStyle = 'max-height: ' + calc + 'px;';
    // Not sure, but probably: 55=filter, 25=??, 24=clear-tags
    listStyle = 'max-height: ' + (calc - 55 - 25 - 24) + 'px;';
  } else {
    return;
  }

  this.el.closest('.TB__Popdown__content').style = popdownStyle;
  if (this.type === 'tag') {
    document.querySelector('.tag-list').style = listStyle;
  }
};

//* Project autocomplete *//

export const ProjectAutoComplete = function (el, item, elem) {
  AutoComplete.call(this, el, item, elem);
  this.onChangeHandler = noop;
  this.selectedItem = -1;
  this.selectedTask = -1;
  this.visibleItems = [];
  this.visibleTasks = [];
};

inheritsFrom(ProjectAutoComplete, AutoComplete);

ProjectAutoComplete.prototype.setup = function (selected, tid) {
  this.setSelected(selected, tid);
  this.placeholderDiv.textContent = this.placeholderDiv.title = this.generateLabel(
    null,
    selected,
    this.type,
    tid
  );
  this.setProjectBullet(selected, tid);
};

ProjectAutoComplete.prototype.addEvents = function () {
  const that = this;

  let item;

  this.super.addEvents.call(this);

  that.el.addEventListener('click', function (e) {
    e.stopPropagation();
    that.selectProject(e.target);
  });

  that.filter.addEventListener('keydown', function (e) {
    if (e.keyCode === 38) {
      // ArrowUp
      that.selectPrevious();
    } else if (e.keyCode === 40) {
      // ArrowDown
      that.selectNext();
    } else if (e.keyCode === 37 || e.keyCode === 39) {
      // Arrow Left/Right (toggle task list)
      item = that.visibleItems[that.selectedItem];
      if (item.querySelector('.task-count')) {
        that.clearSelectedTask();
        that.toggleTaskList(item.querySelector('.task-count'));
      }
    }
  });
};

ProjectAutoComplete.prototype.clearSelectedItem = function () {
  const current = this.el.querySelector('.selected-item');
  if (current) {
    current.classList.remove('selected-item');
  }
};

ProjectAutoComplete.prototype.clearSelectedTask = function () {
  const current = this.el.querySelector('.task-item.selected-item');
  if (current) {
    current.classList.remove('selected-item');
  }
};

ProjectAutoComplete.prototype.selectPrevious = function () {
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

ProjectAutoComplete.prototype.selectNext = function () {
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

ProjectAutoComplete.prototype.scrollDownToView = function (view, item) {
  if (view.scrollTop + view.offsetHeight < item.offsetTop + item.offsetHeight) {
    item.scrollIntoView(false);
  }
};

ProjectAutoComplete.prototype.scrollUpToView = function (view, item) {
  if (view.scrollTop > item.offsetTop) {
    item.scrollIntoView();
  }
};

ProjectAutoComplete.prototype.saveSelected = function () {
  if (this.visibleTasks[this.selectedTask]) {
    this.selectTask(this.visibleTasks[this.selectedTask]);
  } else if (this.visibleItems[this.selectedItem]) {
    this.selectProject(this.visibleItems[this.selectedItem]);
  }
  this.closeDropdown();
};

ProjectAutoComplete.prototype.setSelected = function (ids, tid) {
  const t = this.el.querySelector("li[data-tid='" + tid + "']");
  if (t) {
    this.selectTask(t, true);
    return;
  }
  this.setSelectedProject(ids);
};

ProjectAutoComplete.prototype.setSelectedProject = function (ids) {
  const selected = this.el.querySelectorAll('.selected-' + this.type);

  let i;

  // Clear previously selected
  if (selected.length >= 1) {
    for (i = 0; i < selected.length; i++) {
      selected[i].classList.remove('selected-' + this.type);
    }
  }

  // Select project
  if (ids) {
    this.el
      .querySelector("li[data-pid='" + ids + "']")
      .classList.add('selected-' + this.type);
  }
};

ProjectAutoComplete.prototype.selectTask = function (elem, silent) {
  // Set selected task
  const currentSelected = this.el.querySelector('.selected-task');

  if (currentSelected) {
    currentSelected.classList.remove('selected-task');
  }
  elem.classList.add('selected-task');

  // Set selected project
  this.selectProject(elem.parentNode.parentNode, silent, true);
};

ProjectAutoComplete.prototype.selectProject = function (
  elem,
  silent,
  removeTask
) {
  if (elem.classList.contains('item-name') || elem.classList.contains('tb-project-bullet')) {
    elem = elem.closest('li') || elem.closest('p'); // project row / no-project row
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

  const currentSelected = this.el.querySelector('.selected-' + this.type);

  const val = elem.getAttribute('data-pid');

  if (currentSelected) {
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

ProjectAutoComplete.prototype.toggleTaskList = function (elem) {
  const opened = this.el.querySelector('.tasklist-opened');
  if (opened) {
    opened.classList.remove('tasklist-opened');
  }
  if (opened !== elem.parentNode) {
    elem.parentNode.classList.toggle('tasklist-opened');
  }
};

ProjectAutoComplete.prototype.getSelected = function () {
  const selected = this.el.querySelector('.selected-' + this.type);

  const task = this.el.querySelector('.selected-task');

  const pid = selected ? parseInt(selected.getAttribute('data-pid'), 10) : 0;

  const tid = task ? parseInt(task.getAttribute('data-tid'), 10) : null;

  const name = selected ? selected.getAttribute('title') : '';

  return {
    el: selected,
    pid: pid,
    tid: tid,
    name: name
  };
};

ProjectAutoComplete.prototype.getSelectedProjectByPid = function (pid) {
  const selected = this.el.querySelector("li[data-pid='" + pid + "']");

  const name = selected ? selected.textContent : '';

  return {
    el: selected,
    pid: pid,
    name: name
  };
};

ProjectAutoComplete.prototype.setProjectBullet = function (pid, tid, el) {
  let project;
  const elem = el || this.placeholderItem.querySelector('.tb-project-bullet');
  let result;
  let task;

  if (pid && pid !== '0') {
    project = this.el.querySelector("li[data-pid='" + pid + "']");
    if (project) {
      elem.className = project.querySelector('.tb-project-bullet').className;
      elem.setAttribute(
        'style',
        project.querySelector('.tb-project-bullet').getAttribute('style')
      );
      result = ' - ' + project.getAttribute('title');
      if (tid) {
        task = project.querySelector("li[data-tid='" + tid + "']");
        if (task) {
          result += ' . ' + task.getAttribute('title');
        }
      }
      return result;
    }
  } else {
    // Reset to default.
    elem.setAttribute('style', '');
  }
  elem.className = 'tb-project-bullet';
  return '';
};

ProjectAutoComplete.prototype.generateLabel = function (select, id, type, tid) {
  let selected = false;

  let client;

  let result = '';

  let task;

  select = this.getSelectedProjectByPid(id);

  if (!select) {
    select = this.getSelected();
  }

  if (!!select && !!select.el) {
    selected = select.pid;
    task =
      select.el.querySelector('.selected-task') ||
      select.el.querySelector("li[data-tid='" + tid + "']");
    if (task) {
      result += task.getAttribute('title') + ' . ';
    }
    client = select.el.parentNode.querySelector('.client-row');
    if (client) {
      result = client.textContent + ' - ';
    }
    result += select.el.getAttribute('title');
  }

  if (parseInt(id, 10) === 0 || !selected) {
    return 'Add ' + type;
  }
  return result;
};

ProjectAutoComplete.prototype.filterSelection = function () {
  let key;
  const val = this.filter.value.toLowerCase();
  let row;
  let text;

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
      } else if (row.classList) {
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

ProjectAutoComplete.prototype.closeDropdown = function () {
  this.super.closeDropdown(this, this);
  this.clearSelectedItem();
  this.selectedItem = -1;
};

ProjectAutoComplete.prototype.onChange = function (callback) {
  this.onChangeHandler = callback;
};

ProjectAutoComplete.prototype.removeChangeHandler = function () {
  this.onChangeHandler = noop;
};

//* Tag autocomplete *//

export const TagAutoComplete = function (el, item, elem) {
  AutoComplete.call(this, el, item, elem);
  this.wid = null;
};

inheritsFrom(TagAutoComplete, AutoComplete);

TagAutoComplete.prototype.setup = function (selected, wid) {
  this.setSelected(selected);
  this.setWorkspaceId(wid);
};

TagAutoComplete.prototype.addEvents = function () {
  const that = this;

  const bindedToggleDropdown = that.toggleDropdown.bind(that);

  this.field.addEventListener('focus', function (e) {
    that.openDropdown();

    setTimeout(() => {
      that.placeholderItem.addEventListener('click', bindedToggleDropdown);
    }, 150);
  });

  this.field.addEventListener('focusout', function (e) {
    if (that.field.contains(e.relatedTarget)) return;
    that.placeholderItem.removeEventListener('click', bindedToggleDropdown);
    that.closeDropdown();
  });

  this.el.addEventListener('click', function (e) {
    e.stopPropagation();
    that.selectTag(e);
  });

  this.filter.addEventListener('keyup', function (e) {
    that.filterSelection();
  });

  this.filter.addEventListener('keydown', function (e) {
    if (e.code === 'Tab') {
      that.closeDropdown();
    }

    if (e.keyCode === 13) {
      e.preventDefault();
      that.addNew();
    }

    if (e.keyCode === 27) {
      e.preventDefault();
      that.closeDropdown();
    }
  });

  that.overlay.addEventListener('click', function (e) {
    if (!that.content.contains(e.target) && !that.placeholderItem.contains(e.target)) {
      e.stopPropagation();
      that.closeDropdown();
    }
  });

  this.clearSelected && this.clearSelected.addEventListener('click', function (e) {
    that.clearSelectedTags();
  });

  this.addLink && this.addLink.addEventListener('click', function (e) {
    that.addNew();
  });
};

TagAutoComplete.prototype.closeDropdown = function () {
  this.super.closeDropdown(this, this);
  this.updatePlaceholder();
};

TagAutoComplete.prototype.selectTag = function (e) {
  e.target.classList.toggle('selected-tag');
};

TagAutoComplete.prototype.setSelected = function (tags) {
  let i; let item;

  this.clearSelectedTags();

  if (tags) {
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

TagAutoComplete.prototype.setWorkspaceId = function (wid) {
  this.wid = wid;
  const listItems = this.el.querySelectorAll(this.item);

  const stringWid = wid.toString();

  let tag;

  let key;

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

TagAutoComplete.prototype.clearSelectedTags = function (tags) {
  const current = this.el.querySelectorAll('.tag-list li.selected-tag');

  let i;

  for (i = 0; i < current.length; i += 1) {
    current[i].classList.remove('selected-tag');
  }
};

TagAutoComplete.prototype.updatePlaceholder = function (tags) {
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

TagAutoComplete.prototype.getSelected = function () {
  const tags = [];

  let tag;

  let i;

  const s = this.el.querySelectorAll('.tag-list .selected-tag');
  for (i = 0; i < s.length; i += 1) {
    tag = s[i].textContent;
    tags.push(tag);
  }
  return tags;
};

TagAutoComplete.prototype.filterSelection = function () {
  let key;

  const val = this.filter.value.toLowerCase();

  let row;

  let text;

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
      } else if (row.classList) {
        row.classList.remove('filter');
      }
    }
  }
  this.updateAddLink(val);
};

TagAutoComplete.prototype.updateAddLink = function (filterValue = '') {
  if (this.addLink) {
    if (this.exactMatch || filterValue === '') {
      this.addLink.parentNode.classList.remove('add-allowed');
    } else {
      this.addLink.parentNode.classList.add('add-allowed');
      this.addLink.querySelector('span').textContent = filterValue;
    }
  }
};

TagAutoComplete.prototype.addNew = function (text) {
  const val = text || this.filter.value;

  const list = this.el.querySelector('.' + this.type + '-list');

  const item = document.createElement('li');

  if (!val) {
    return;
  }

  item.className = this.type + '-item selected-' + this.type;
  item.setAttribute('title', val);
  item.textContent = val;

  list.insertBefore(item, list.querySelector('li:first-child'));
  this.filter.value = '';
  this.filterSelection();
};
