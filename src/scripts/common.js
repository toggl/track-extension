import { ProjectAutoComplete, TagAutoComplete } from './lib/autocomplete';
const browser = require('webextension-polyfill');

let projectAutocomplete; let tagAutocomplete;

window.$ = (s, elem) => {
  elem = elem || document;
  return elem.querySelector(s);
};

window.createTag = (name, className, textContent) => {
  const tag = document.createElement(name);
  tag.className = className;

  if (textContent) {
    tag.textContent = textContent;
  }

  return tag;
};

function createLink (className, tagName, linkHref) {
  // Param defaults
  tagName = tagName || 'a';
  linkHref = linkHref || '#';
  const link = createTag(tagName, className);

  if (tagName === 'a') {
    link.href = linkHref;
  }

  link.appendChild(document.createTextNode('Start timer'));
  return link;
}

function invokeIfFunction (trial) {
  if (trial instanceof Function) {
    return trial();
  }
  return trial;
}

function getFullPageHeight () {
  const body = document.body;

  const html = document.documentElement;

  return Math.max(
    body.scrollHeight,
    body.offsetHeight,
    html.clientHeight,
    html.scrollHeight,
    html.offsetHeight
  );
}

function setCursorAtBeginning (elem) {
  elem.focus();
  elem.setSelectionRange(0, 0);
  elem.scrollLeft = 0;
}

function secondsToTime (duration, format) {
  duration = Math.abs(duration);
  let response;

  let seconds = parseInt(duration % 60, 10);

  let minutes = parseInt((duration / 60) % 60, 10);

  let hours = parseInt(duration / (60 * 60), 10);

  let hoursString = '';

  if (hours > 0) {
    hours = hours < 10 ? '0' + hours : hours;
    hoursString += hours + 'h ';
  }

  minutes = minutes < 10 ? '0' + minutes : minutes;
  seconds = seconds < 10 ? '0' + seconds : seconds;

  // Use the format defined in user preferences
  if (format === 'improved') {
    response = hours + ':' + minutes + ':' + seconds;
  } else if (format === 'decimal') {
    response = hours + '.' + parseInt((minutes * 100) / 60, 10) + 'h';
  } else {
    response = hoursString + minutes + 'm ' + seconds + 's';
  }

  return response;
}

window.togglbutton = {
  $billable: null,
  isStarted: false,
  element: null,
  serviceName: '',
  projectBlurTrigger: null,
  taskBlurTrigger: null,
  tagsVisible: false,
  hasTasks: false,
  entries: {},
  projects: {},
  user: {},
  duration_format: '',
  currentDescription: '',
  fullPageHeight: getFullPageHeight(),
  fullVersion: 'TogglButton',
  render: function (selector, opts, renderer, mutationSelector) {
    browser.runtime.sendMessage({ type: 'activate' })
      .then(function (response) {
        if (response.success) {
          try {
            togglbutton.user = response.user;
            togglbutton.entries = response.user.time_entries;
            togglbutton.projects = response.user.projectMap;
            togglbutton.fullVersion = response.version;
            togglbutton.duration_format = response.user.duration_format;
            if (opts.observe) {
              let debouncer = null;
              const observer = new MutationObserver(function (mutations) {
                // If mutationSelector is defined, render the start timer link only when an element
                // matching the selector changes.
                // Multiple selectors can be used by comma separating them.
                // mutationSelector = mutationSelector ? `${mutationSelector},*:not(.toggl-button)` : '*:not(.toggl-button)';
                if (mutationSelector) {
                  const matches = mutations.filter(function (mutation) {
                    return mutation.target.matches(mutationSelector);
                  });
                  if (!matches.length) {
                    return;
                  }
                }
                if (opts.debounceInterval > 0) {
                  if (debouncer) {
                    clearTimeout(debouncer);
                  }
                  debouncer = setTimeout(function () {
                    togglbutton.renderTo(selector, renderer);
                  }, opts.debounceInterval);
                } else {
                  togglbutton.renderTo(selector, renderer);
                }
              });
              const observeTarget = opts.observeTarget || document;
              observer.observe(observeTarget, { childList: true, subtree: true });
            }
            togglbutton.renderTo(selector, renderer);
          } catch (e) {
            browser.runtime.sendMessage({
              type: 'error',
              stack: e.stack,
              category: 'Content'
            });
          }
        }
      })
      .catch((e) => {
        browser.runtime.sendMessage({
          type: 'error',
          stack: e.stack || null,
          category: 'Content'
        });
      });
  },

  renderTo: function (selector, renderer) {
    let i;

    let len;

    const elems = document.querySelectorAll(selector);
    if (!elems.length) {
      return;
    }

    for (i = 0, len = elems.length; i < len; i += 1) {
      elems[i].classList.add('toggl');
    }

    // Catch content errors here as well as render() in case of async rendering
    // (MutationObserver)
    try {
      for (i = 0, len = elems.length; i < len; i += 1) {
        renderer(elems[i]);
      }
      togglbutton.queryAndUpdateTimerLink();
    } catch (e) {
      browser.runtime.sendMessage({
        type: 'error',
        stack: e.stack,
        category: 'Content'
      });
    }
  },

  topPosition: function (rect, editFormWidth, editFormHeight) {
    let left = rect.left - 10;

    let top = rect.top + document.body.scrollTop - 10;

    if (left + editFormWidth > window.innerWidth) {
      left = window.innerWidth - 10 - editFormWidth;
    }
    if (top + editFormHeight > togglbutton.fullPageHeight) {
      top = window.innerHeight + document.body.scrollTop - 10 - editFormHeight;
    }
    return { left: left, top: top };
  },

  calculateTrackedTime: function () {
    let duration = 0;

    const description = togglbutton.mainDescription.toLowerCase();

    const projectId = togglbutton.findProjectIdByName(
      togglbutton.currentProject);

    if (togglbutton.entries) {
      togglbutton.entries.forEach(function (entry) {
        if (
          !!entry.description &&
          entry.description.toLowerCase() === description &&
          entry.pid === projectId
        ) {
          duration += entry.duration;
        }
      });
    }

    return secondsToTime(duration, togglbutton.duration_format);
  },

  findProjectByPid: function (pid) {
    let key;
    for (key in togglbutton.user.projectMap) {
      if (
        togglbutton.user.projectMap.hasOwnProperty(key) &&
        togglbutton.user.projectMap[key].id === pid
      ) {
        return togglbutton.user.projectMap[key];
      }
    }
    return undefined;
  },

  updateBillable: function (pid, noOverwrite) {
    let project;

    let i;

    let pwid = togglbutton.user.default_wid;

    const ws = togglbutton.user.workspaces;

    let premium;

    if (pid !== 0) {
      project = togglbutton.findProjectByPid(pid);
      if (!project) {
        return;
      }
      pwid = project.wid;
    }

    for (i = 0; i < ws.length; i++) {
      if (ws[i].id === pwid) {
        premium = ws[i].premium;
        break;
      }
    }

    togglbutton.toggleBillable(premium);

    if (!noOverwrite && (pid !== 0 && project.billable)) {
      togglbutton.$billable.classList.toggle('tb-checked', true);
    }
  },

  toggleBillable: function (visible) {
    const tabIndex = visible ? '0' : '-1';
    togglbutton.$billable.setAttribute('tabindex', tabIndex);
    togglbutton.$billable.classList.toggle('no-billable', !visible);
  },

  setupBillable: function (billable, pid) {
    togglbutton.updateBillable(pid, true);
    togglbutton.$billable.classList.toggle('tb-checked', billable);
  },

  addEditForm: function (response) {
    togglbutton.hasTasks = response.hasTasks;
    if (response === null || !response.showPostPopup) {
      return;
    }

    const pid = response.entry.pid;
    const tid = response.entry.tid;
    const editFormHeight = 300;
    const editFormWidth = 360;
    const div = document.createElement('div');
    let editForm;
    let togglButtonDescription;

    const elemRect = togglbutton.element.getBoundingClientRect();
    editForm = $('#toggl-button-edit-form');
    const position = togglbutton.topPosition(
      elemRect, editFormWidth, editFormHeight);

    if (editForm !== null) {
      togglButtonDescription = $('#toggl-button-description');
      togglButtonDescription.value = response.entry.description || '';

      projectAutocomplete.setup(pid, tid);
      tagAutocomplete.setup(response.entry.tags, response.entry.wid);
      togglbutton.setupBillable(!!response.entry.billable, pid);

      editForm.style.left = position.left + 'px';
      editForm.style.top = position.top + 'px';
      editForm.style.display = 'block';
      setCursorAtBeginning(togglButtonDescription);
      return;
    }

    div.innerHTML = response.html.replace('{service}', togglbutton.serviceName);
    editForm = div.firstChild;
    editForm.style.left = position.left + 'px';
    editForm.style.top = position.top + 'px';
    editForm.classList.add('toggl-integration');
    document.body.appendChild(editForm);
    togglbutton.$billable = $('.tb-billable', editForm);

    projectAutocomplete = new ProjectAutoComplete('project', 'li', togglbutton);
    tagAutocomplete = new TagAutoComplete('tag', 'li', togglbutton);

    const closeForm = function () {
      projectAutocomplete.closeDropdown();
      tagAutocomplete.closeDropdown();
      editForm.style.display = 'none';
    };

    const submitForm = function (that) {
      const selected = projectAutocomplete.getSelected();

      const billable = !!document.querySelector(
        '.tb-billable.tb-checked:not(.no-billable)'
      );

      const request = {
        type: 'update',
        description: $('#toggl-button-description').value,
        pid: selected.pid,
        projectName: selected.name,
        tags: tagAutocomplete.getSelected(),
        tid: selected.tid,
        billable: billable,
        service: togglbutton.serviceName
      };
      browser.runtime.sendMessage(request);
      closeForm();
    };

    // Fill in data if edit form was not present
    togglButtonDescription = $('#toggl-button-description', editForm);
    togglButtonDescription.value = response.entry.description || '';
    setCursorAtBeginning(togglButtonDescription);
    projectAutocomplete.setup(pid, tid);
    tagAutocomplete.setSelected(response.entry.tags);
    tagAutocomplete.setWorkspaceId(response.entry.wid);

    togglbutton.setupBillable(!!response.entry.billable, pid);

    // Data fill end
    $('#toggl-button-hide', editForm).addEventListener('click', function (e) {
      closeForm();
    });

    $('#toggl-button-update', editForm).addEventListener('click', function (e) {
      submitForm(this);
    });

    $('#toggl-button-update').addEventListener('keydown', function (e) {
      if (e.code === 'Enter' || e.code === 'Space') {
        submitForm(this);
      }
    });

    $('form', editForm).addEventListener('submit', function (e) {
      submitForm(this);
      e.preventDefault();
    });

    $('.toggl-button', editForm).addEventListener('click', function (e) {
      e.preventDefault();
      const link = togglbutton.element;
      link.classList.remove('active');
      link.style.color = '';
      if (!link.classList.contains('min')) {
        link.textContent = 'Start timer';
      }
      browser.runtime
        .sendMessage({ type: 'stop' })
        .then(togglbutton.addEditForm);

      closeForm();
      return false;
    });

    /* prevent certain host webapps from processing key commands */
    $('form', editForm).addEventListener('keydown', function (e) {
      e.stopPropagation();
    });

    togglbutton.$billable.addEventListener('click', function () {
      this.classList.toggle('tb-checked');
    });

    togglbutton.$billable.addEventListener('keydown', function (e) {
      let prevent = false;
      if (e.code === 'Space') {
        prevent = true;
        this.classList.toggle('tb-checked');
      }

      if (e.code === 'ArrowLeft') {
        prevent = true;
        this.classList.toggle('tb-checked', false);
      }

      if (e.code === 'ArrowRight') {
        prevent = true;
        this.classList.toggle('tb-checked', true);
      }

      if (prevent) {
        e.stopPropagation();
        e.preventDefault();
      }
    });

    projectAutocomplete.onChange(function (selected) {
      const project = togglbutton.findProjectByPid(selected.pid);

      const wid = project ? project.wid : response.entry.wid;

      tagAutocomplete.setWorkspaceId(wid);
    });
  },

  createTimerLink: function (params) {
    let link = createLink('toggl-button');

    const project = invokeIfFunction(params.projectName);
    const description = invokeIfFunction(params.description);
    togglbutton.currentProject = project;
    togglbutton.currentDescription = description;
    link.title = description + (project ? ' - ' + project : '');
    if (params.calculateTotal) {
      togglbutton.mainDescription = description;
    }

    link.classList.add(params.className);
    togglbutton.serviceName = params.className;

    if (params.buttonType === 'minimal') {
      link.classList.add('min');
      link.removeChild(link.firstChild);
      link.title = 'Start timer: ' + link.title;
    }

    link.addEventListener('click', function (e) {
      let opts;
      e.preventDefault();
      e.stopPropagation();
      link = e.target;

      if (link.classList.contains('active')) {
        togglbutton.deactivateTimerLink(link);
        opts = {
          type: 'stop',
          respond: true,
          service: togglbutton.serviceName
        };
      } else {
        togglbutton.activateTimerLink(link);
        opts = {
          type: 'timeEntry',
          respond: true,
          projectId: invokeIfFunction(params.projectId),
          description: invokeIfFunction(params.description),
          tags: invokeIfFunction(params.tags),
          projectName: invokeIfFunction(params.projectName),
          createdWith: togglbutton.fullVersion + '-' + togglbutton.serviceName,
          service: togglbutton.serviceName,
          url: window.location.href
        };
      }
      togglbutton.element = e.target;
      browser.runtime
        .sendMessage(opts)
        .then(togglbutton.addEditForm);

      return false;
    });

    return link;
  },

  // Query active timer entry, and set it to active.
  queryAndUpdateTimerLink: function () {
    // new button created - set state
    browser.runtime.sendMessage({ type: 'currentEntry' })
      .then(function (response) {
        togglbutton.updateTimerLink(response.currentEntry);
      });
  },

  // Make button corresponding to 'entry' active, if any. ; otherwise inactive.
  updateTimerLink: function (entry) {
    if (!entry) {
      togglbutton.deactivateAllTimerLinks();
      return;
    }

    // Sort to find the "Best matching button".
    // E.g. if running entry is `I am cat`, it should match `I am cat` over `I am cat and dog`
    // Note: don't know why this isn't an exact match, probably some legacy reasons.
    const matchingButtons = Array.from(document.querySelectorAll(
      '.toggl-button:not(.toggl-button-edit-form-button)'))
      .filter(button => button.title.indexOf(entry.description) !== -1)
      .sort((a, b) => {
        if (a.title.length > b.title.length) return -1;
        if (b.title.length < a.title.length) return 1;
        return 0;
      });
    const bestMatch = matchingButtons.pop();

    if (bestMatch) {
      togglbutton.activateTimerLink(bestMatch);
    } else {
      togglbutton.deactivateAllTimerLinks();
    }
  },

  activateTimerLink: function (link) {
    if (link.classList.contains('active')) {
      return;
    }

    togglbutton.deactivateAllTimerLinks();
    link.classList.add('active');
    link.style.color = '#1ab351';

    const isMinimal = link.classList.contains('min');
    if (!isMinimal) {
      link.textContent = 'Stop timer';
    }
  },

  deactivateAllTimerLinks: function () {
    const allActive = document.querySelectorAll(
      '.toggl-button.active:not(.toggl-button-edit-form-button)');
    for (const active of allActive) {
      togglbutton.deactivateTimerLink(active);
    }
  },

  deactivateTimerLink: function (link) {
    link.classList.remove('active');
    link.style.color = '';
    const minimal = link.classList.contains('min');
    if (!minimal) {
      link.textContent = 'Start timer';
    }
  },

  updateTrackedTimerLink: function () {
    const totalTime = $('.toggl-tracked');

    let duration;

    let h3;

    let p;

    if (totalTime) {
      duration = togglbutton.calculateTrackedTime();

      h3 = document.createElement('h3');
      h3.textContent = 'Time tracked';

      p = document.createElement('p');
      p.setAttribute('title', 'Time tracked with Toggl: ' + duration);
      p.textContent = duration;

      totalTime.appendChild(h3);
      totalTime.appendChild(p);
    }
  },

  findProjectIdByName: function (name) {
    let key;
    for (key in togglbutton.projects) {
      if (
        togglbutton.projects.hasOwnProperty(key) &&
        togglbutton.projects[key].name === name
      ) {
        return togglbutton.projects[key].id;
      }
    }
    return undefined;
  },

  newMessage: function (request, sender, sendResponse) {
    if (request.type === 'stop-entry') {
      togglbutton.updateTimerLink();
      togglbutton.entries = request.user.time_entries;
      togglbutton.projects = request.user.projectMap;
      togglbutton.updateTrackedTimerLink();
    } else if (request.type === 'sync') {
      if ($('#toggl-button-edit-form') !== null) {
        $('#toggl-button-edit-form').remove();
      }
    }
    return undefined;
  }
};

browser.runtime.onMessage.addListener(togglbutton.newMessage);
window.addEventListener('focus', function (e) {
  // update button state
  togglbutton.queryAndUpdateTimerLink();
});
