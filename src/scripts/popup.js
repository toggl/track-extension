import { ProjectAutoComplete, TagAutoComplete } from './lib/autocomplete';

var TogglButton = chrome.extension.getBackgroundPage().TogglButton,
  db = chrome.extension.getBackgroundPage().db,
  FF = navigator.userAgent.indexOf('Chrome') === -1;

if (FF) {
  document.querySelector('body').classList.add('ff');
}

window.PopUp = {
  $postStartText: ' post-start popup',
  $popUpButton: null,
  $togglButton: document.querySelector('.stop-button'),
  $resumeButton: document.querySelector('.resume-button'),
  $errorLabel: document.querySelector('.error'),
  $editButton: document.querySelector('.edit-button'),
  $tagIcon: document.querySelector('.tag-icon'),
  $projectBullet: document.querySelector('.timer .tb-project-bullet'),
  $projectAutocomplete: null,
  $tagAutocomplete: null,
  $timerRow: document.querySelector('.timer'),
  $timer: null,
  $tagsVisible: false,
  mousedownTrigger: null,
  projectBlurTrigger: null,
  editFormAdded: false,
  durationChanged: false,
  $billable: null,
  $header: document.querySelector('.header'),
  $menuView: document.querySelector('#menu'),
  $editView: document.querySelector('#entry-form'),
  $loginView: document.querySelector('#login-form'),
  $revokedWorkspaceView: document.querySelector('#revoked-workspace'),
  $entries: document.querySelector('.entries-list'),
  defaultErrorMessage: 'Error connecting to server',
  showPage: function() {
    var p, dom;
    if (!TogglButton) {
      TogglButton = chrome.extension.getBackgroundPage().TogglButton;
    }

    try {
      if (TogglButton.$user !== null) {
        if (!PopUp.editFormAdded) {
          dom = document.createElement('div');
          dom.innerHTML = TogglButton.getEditForm();
          PopUp.$editView.appendChild(dom.firstChild);
          PopUp.addEditEvents();
          PopUp.editFormAdded = true;
        }
        document
          .querySelector('.header .icon')
          .setAttribute('title', 'Open toggl.com - ' + TogglButton.$user.email);
        PopUp.$timerRow.classList.remove('has-resume');
        if (TogglButton.$curEntry === null) {
          PopUp.$togglButton.setAttribute('data-event', 'timeEntry');
          PopUp.$togglButton.textContent = 'Start new';
          PopUp.$togglButton.parentNode.classList.remove('tracking');
          PopUp.$projectBullet.className = 'tb-project-bullet';
          if (TogglButton.$latestStoppedEntry) {
            p = TogglButton.findProjectByPid(
              TogglButton.$latestStoppedEntry.pid
            );
            p = !!p ? ' - ' + p.name : '';
            PopUp.$resumeButton.title =
              TogglButton.$latestStoppedEntry.description + p;
            PopUp.$timerRow.classList.add('has-resume');
            localStorage.setItem(
              'latestStoppedEntry',
              JSON.stringify(TogglButton.$latestStoppedEntry)
            );
            PopUp.$resumeButton.setAttribute('data-event', 'resume');
          }
        } else {
          PopUp.$togglButton.setAttribute('data-event', 'stop');
          PopUp.$togglButton.textContent = 'Stop';
          PopUp.$togglButton.parentNode.classList.add('tracking');
          PopUp.showCurrentDuration(true);
        }
        if (!PopUp.$header.getAttribute('data-view')) {
          PopUp.switchView(PopUp.$menuView);
        }
        PopUp.renderEntriesList();
        PopUp.renderSummary();
      } else {
        localStorage.setItem('latestStoppedEntry', '');
        PopUp.switchView(PopUp.$loginView);
      }
    } catch (e) {
      chrome.runtime.sendMessage({
        type: 'error',
        stack: e.stack,
        category: 'Popup'
      });
    }
  },

  sendMessage: function(request) {
    chrome.runtime.sendMessage(request, function(response) {
      if (!response) {
        return;
      }

      if (
        request.type === 'list-continue' &&
        !request.data &&
        !response.success
      ) {
        return PopUp.switchView(PopUp.$revokedWorkspaceView);
      }

      if (response.success) {
        if (request.type === 'create-workspace') {
          return PopUp.switchView(PopUp.$menuView);
        }
        if (
          !!response.type &&
          response.type === 'New Entry' &&
          Db.get('showPostPopup')
        ) {
          PopUp.updateEditForm(PopUp.$editView);
        } else if (response.type === 'Update') {
          TogglButton = chrome.extension.getBackgroundPage().TogglButton;
        } else {
          window.location.reload();
        }
      } else if (
        request.type === 'login' ||
        (!!response.type &&
          (response.type === 'New Entry' || response.type === 'Update'))
      ) {
        PopUp.showError(response.error || PopUp.defaultErrorMessage);
      }
    });
  },

  showError: function(errorMessage) {
    PopUp.$errorLabel.textContent = errorMessage;
    PopUp.$errorLabel.classList.add('show');
    setTimeout(function() {
      PopUp.$errorLabel.classList.remove('show');
    }, 3000);
  },

  showCurrentDuration: function(startTimer) {
    if (TogglButton.$curEntry === null) {
      PopUp.$togglButton.setAttribute('data-event', 'timeEntry');
      PopUp.$togglButton.setAttribute('title', '');
      PopUp.$togglButton.textContent = 'Start new';
      PopUp.$togglButton.parentNode.classList.remove('tracking');
      clearInterval(PopUp.$timer);
      PopUp.$timer = null;
      PopUp.$projectBullet.className = 'tb-project-bullet';
      return;
    }

    var duration = PopUp.msToTime(
        new Date() - new Date(TogglButton.$curEntry.start)
      ),
      description = TogglButton.$curEntry.description || '(no description)',
      durationField = document.querySelector('#toggl-button-duration');

    PopUp.$togglButton.textContent = duration;

    // Update edit form duration field
    if (
      durationField !== document.activeElement &&
      PopUp.durationChanged === false
    ) {
      durationField.value = duration;
    } else {
      PopUp.durationChanged = true;
    }

    if (startTimer) {
      if (!PopUp.$timer) {
        PopUp.$timer = setInterval(function() {
          PopUp.showCurrentDuration();
        }, 1000);
      }
      description += PopUp.$projectAutocomplete.setProjectBullet(
        TogglButton.$curEntry.pid,
        TogglButton.$curEntry.tid,
        PopUp.$projectBullet
      );
      PopUp.$editButton.textContent = description;
      PopUp.$editButton.setAttribute(
        'title',
        'Click to edit "' + description + '"'
      );

      PopUp.setupIcons(TogglButton.$curEntry);
    }
  },

  updateMenuTimer: function(data) {
    var description = data.description || '(no description)';

    description += PopUp.$projectAutocomplete.setProjectBullet(
      data.pid,
      data.tid,
      PopUp.$projectBullet
    );
    PopUp.$editButton.textContent = description;
    PopUp.$editButton.setAttribute(
      'title',
      'Click to edit "' + description + '"'
    );

    PopUp.setTagIcon(data.tags);
  },

  renderSummary: function() {
    var sums = TogglButton.calculateSums();

    document.querySelector('.summary .s-today > span').textContent = sums.today;
    document.querySelector('.summary .s-week > span').textContent = sums.week;
  },

  renderEntriesList: function() {
    var html = document.createElement('div'),
      entries = TogglButton.$user.time_entries,
      listEntries = [],
      visibleIcons = '',
      joinedTags,
      te,
      iconDiv,
      p,
      pname,
      pstyle,
      elem,
      ul,
      li,
      t,
      b,
      i,
      count = 0,
      checkUnique;

    if (!entries || entries.length < 1) {
      return;
    }

    checkUnique = function(te, listEntries) {
      var j;
      if (listEntries.length > 0) {
        for (j = 0; j < listEntries.length; j++) {
          if (
            listEntries[j].description === te.description &&
            listEntries[j].pid === te.pid
          ) {
            return false;
          }
        }
      }
      listEntries.push(te);
      return te;
    };

    ul = document.createElement('ul');

    for (i = entries.length - 1; i >= 0; i--) {
      if (count >= 5) {
        break;
      }
      te = checkUnique(entries[i], listEntries);
      if (!!te && te.duration >= 0) {
        visibleIcons = '';
        p = TogglButton.findProjectByPid(te.pid);
        if (!!p) {
          pname = p.name;
          pstyle = 'background-color: ' + p.hex_color + ';';
          p = document.createElement('div');
          p.className = 'tb-project-bullet tb-project-color';
          p.setAttribute('style', pstyle);
        } else {
          p = false;
        }

        t = !!te.tags && te.tags.length;
        joinedTags = t ? te.tags.join(', ') : '';

        t = t ? 'tag-icon-visible' : '';
        b = !!te.billable ? 'billable-icon-visible' : '';
        visibleIcons = t + ' ' + b;

        li = document.createElement('li');
        li.setAttribute('data-id', i);

        // Description
        elem = document.createElement('div');
        elem.className = 'te-desc';
        elem.setAttribute('title', te.description);
        elem.textContent = te.description || '(no description)';
        li.appendChild(elem);

        // Project bullet and name
        elem = document.createElement('div');
        elem.className = 'te-proj';
        if (!!p) {
          elem.appendChild(p);
          elem.appendChild(document.createTextNode(pname));
        }
        li.appendChild(elem);

        // Continue Button
        elem = document.createElement('div');
        elem.className = 'te-continue';
        elem.textContent = 'Continue';
        li.appendChild(elem);

        // Icons
        elem = document.createElement('div');
        elem.className = 'te-icons ' + visibleIcons;

        iconDiv = document.createElement('div');
        iconDiv.className = 'tag-icon';
        iconDiv.setAttribute('title', joinedTags);
        elem.appendChild(iconDiv);

        iconDiv = document.createElement('div');
        iconDiv.className = 'billable-icon';
        iconDiv.setAttribute('title', 'billable');
        elem.appendChild(iconDiv);
        li.appendChild(elem);

        ul.appendChild(li);
        count++;
      }
    }
    if (count === 0) {
      return;
    }

    elem = document.createElement('p');
    elem.textContent = 'Recent entries';
    elem.addEventListener('click', e => e.stopPropagation());
    html.appendChild(elem);

    html.appendChild(ul);

    // Remove old html
    while (PopUp.$entries.firstChild) {
      PopUp.$entries.removeChild(PopUp.$entries.firstChild);
    }

    PopUp.$entries.appendChild(html);
  },

  setupIcons: function(data) {
    PopUp.setTagIcon(data.tags);
    PopUp.setBillableIcon(!!data.billable);
  },

  setTagIcon: function(tags) {
    var t = !!tags && !!tags.length,
      joinedTags = t ? tags.join(', ') : '';

    PopUp.$timerRow.classList.toggle('tag-icon-visible', t);
    PopUp.$tagIcon.setAttribute('title', joinedTags);
  },

  setBillableIcon: function(billable) {
    PopUp.$timerRow.classList.toggle('billable-icon-visible', billable);
  },

  switchView: function(view) {
    PopUp.$header.setAttribute('data-view', view.id);
  },

  formatMe: function(n) {
    return n < 10 ? '0' + n : n;
  },

  msToTime: function(duration) {
    var seconds = parseInt((duration / 1000) % 60, 10),
      minutes = parseInt((duration / (1000 * 60)) % 60, 10),
      hours = parseInt(duration / (1000 * 60 * 60), 10);

    hours = hours < 10 ? '0' + hours : hours;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;

    return hours + ':' + minutes + ':' + seconds;
  },

  /* Edit form functions */
  updateEditForm: function(view) {
    var pid = !!TogglButton.$curEntry.pid ? TogglButton.$curEntry.pid : 0,
      tid = !!TogglButton.$curEntry.tid ? TogglButton.$curEntry.tid : 0,
      wid = TogglButton.$curEntry.wid,
      togglButtonDescription = document.querySelector(
        '#toggl-button-description'
      ),
      togglButtonDuration = document.querySelector('#toggl-button-duration');

    togglButtonDescription.value = !!TogglButton.$curEntry.description
      ? TogglButton.$curEntry.description
      : '';
    togglButtonDuration.value = PopUp.msToTime(
      new Date() - new Date(TogglButton.$curEntry.start)
    );

    PopUp.$projectAutocomplete.setup(pid, tid);
    PopUp.$tagAutocomplete.setup(TogglButton.$curEntry.tags, wid);

    PopUp.setupBillable(!!TogglButton.$curEntry.billable, pid);
    PopUp.switchView(view);

    // Put focus to the beginning of desctiption field
    togglButtonDescription.focus();
    togglButtonDescription.setSelectionRange(0, 0);
    togglButtonDescription.scrollLeft = 0;

    PopUp.durationChanged = false;
  },

  updateBillable: function(pid, no_overwrite) {
    var project,
      i,
      pwid = TogglButton.$user.default_wid,
      ws = TogglButton.$user.workspaces,
      premium;

    if (pid === 0) {
      pwid = TogglButton.$user.default_wid;
    } else {
      project = TogglButton.findProjectByPid(pid);
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

    PopUp.toggleBillable(premium);

    if (!no_overwrite && (pid !== 0 && project.billable)) {
      PopUp.$billable.classList.toggle('tb-checked', true);
    }
  },

  // Duration changed let's calculate new start
  getStart: function() {
    var arr = document.querySelector('#toggl-button-duration').value.split(':'),
      duration,
      now,
      start;

    if (!PopUp.isNumber(arr.join(''))) {
      return false;
    }

    duration = 1000 * (arr[2] || 0) + 60000 * arr[1] + 3600000 * arr[0];

    now = new Date();
    start = new Date(now.getTime() - duration);
    return start.toISOString();
  },

  isNumber: function(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  },

  toggleBillable: function(visible) {
    var tabIndex = visible ? '103' : '-1';
    PopUp.$billable.setAttribute('tabindex', tabIndex);
    PopUp.$billable.classList.toggle('no-billable', !visible);
  },

  setupBillable: function(billable, pid) {
    PopUp.updateBillable(pid, true);
    PopUp.$billable.classList.toggle('tb-checked', billable);
  },

  submitForm: function(that) {
    if (!this.isformValid()) {
      return;
    }
    var selected = PopUp.$projectAutocomplete.getSelected(),
      billable = !!document.querySelector(
        '.tb-billable.tb-checked:not(.no-billable)'
      ),
      request = {
        type: 'update',
        description: document.querySelector('#toggl-button-description').value,
        pid: selected.pid,
        projectName: selected.name,
        tags: PopUp.$tagAutocomplete.getSelected(),
        tid: selected.tid,
        respond: true,
        billable: billable,
        service: 'dropdown'
      },
      start = PopUp.getStart();

    if (start) {
      request.start = start;
    }

    PopUp.sendMessage(request);
    PopUp.updateMenuTimer(request);
    PopUp.switchView(PopUp.$menuView);
  },

  isformValid: function() {
    return !!document.querySelector('#toggl-button-edit-form form:valid');
  },

  addEditEvents: function() {
    /* Edit form events */
    PopUp.$projectAutocomplete = new ProjectAutoComplete(
      'project',
      'li',
      PopUp
    );
    PopUp.$tagAutocomplete = new TagAutoComplete('tag', 'li', PopUp);
    PopUp.$billable = document.querySelector('.tb-billable');

    document
      .querySelector('#toggl-button-update')
      .addEventListener('click', function(e) {
        PopUp.submitForm(this);
      });

    document
      .querySelector('#toggl-button-update')
      .addEventListener('keydown', function(e) {
        if (e.code === 'Enter' || e.code === 'Space') {
          PopUp.submitForm(this);
        }
      });

    document
      .querySelector('#entry-form form')
      .addEventListener('submit', function(e) {
        PopUp.submitForm(this);
        e.preventDefault();
      });

    PopUp.$projectAutocomplete.onChange(function(selected) {
      var project = TogglButton.findProjectByPid(selected.pid),
        wid = project ? project.wid : TogglButton.$curEntry.wid;

      PopUp.$tagAutocomplete.setWorkspaceId(wid);
    });

    PopUp.$billable.addEventListener('click', function() {
      this.classList.toggle('tb-checked');
    });

    PopUp.$billable.addEventListener('keydown', function(e) {
      var prevent = false;
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
  }
};

document.addEventListener('DOMContentLoaded', function() {
  var onClickSendMessage,
    req = {
      type: 'sync',
      respond: false
    };

  try {
    PopUp.sendMessage(req);
    PopUp.showPage();
    PopUp.$editButton.addEventListener('click', function() {
      PopUp.updateEditForm(PopUp.$editView);
    });
    onClickSendMessage = function() {
      var request = {
        type: this.getAttribute('data-event'),
        respond: true,
        service: 'dropdown'
      };
      clearInterval(PopUp.$timer);
      PopUp.$timer = null;

      PopUp.sendMessage(request);
    };
    PopUp.$togglButton.addEventListener('click', onClickSendMessage);
    PopUp.$resumeButton.addEventListener('click', onClickSendMessage);

    document
      .querySelector('.header .cog')
      .addEventListener('click', function() {
        var request = {
          type: 'options',
          respond: false
        };

        chrome.runtime.sendMessage(request);
      });

    document
      .querySelector('.header .logout')
      .addEventListener('click', function() {
        var request = {
          type: 'logout',
          respond: true
        };
        PopUp.sendMessage(request);
      });

    document
      .querySelector('.header .sync')
      .addEventListener('click', function() {
        var request = {
          type: 'sync',
          respond: false
        };
        PopUp.sendMessage(request);
        window.close();
      });

    document
      .querySelector('#signin')
      .addEventListener('submit', function(event) {
        event.preventDefault();
        PopUp.$errorLabel.classList.remove('show');
        var request = {
          type: 'login',
          respond: true,
          username: document.querySelector('#login_email').value,
          password: document.querySelector('#login_password').value
        };
        PopUp.sendMessage(request);
      });

    document
      .querySelector('#workspace')
      .addEventListener('submit', function(event) {
        event.preventDefault();
        const workspace = document.querySelector('#workspace_name').value;
        if (!workspace) {
          return PopUp.showError('Enter a workspace name');
        }
        const request = {
          type: 'create-workspace',
          respond: true,
          workspace
        };
        PopUp.sendMessage(request);
      });

    document
      .querySelector('.header .icon')
      .addEventListener('click', function() {
        chrome.tabs.create({ url: 'https://toggl.com/app' });
      });

    PopUp.$entries.addEventListener('click', function(e) {
      const id = e.target.closest('[data-id]').getAttribute('data-id');
      const timeEntry = TogglButton.$user.time_entries[id]

      var request = {
        type: 'list-continue',
        respond: true,
        service: 'dropdown-list',
        data: timeEntry
      };

      PopUp.sendMessage(request);
    });
  } catch (e) {
    chrome.runtime.sendMessage({
      type: 'error',
      stack: e.stack,
      category: 'Popup'
    });
  }
});
