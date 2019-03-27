import React from 'react';
import ReactDOM from 'react-dom';

import TimeEntriesList from './components/TimeEntriesList';
import Timer from './components/Timer';
import { ProjectAutoComplete, TagAutoComplete } from './lib/autocomplete';
const browser = require('webextension-polyfill');

let TogglButton = browser.extension.getBackgroundPage().TogglButton;
const FF = navigator.userAgent.indexOf('Chrome') === -1;

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
  showPage: function () {
    let dom;
    if (!TogglButton) {
      TogglButton = browser.extension.getBackgroundPage().TogglButton;
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

        if (TogglButton.$curEntry === null) {
          if (TogglButton.$latestStoppedEntry) {
            localStorage.setItem(
              'latestStoppedEntry',
              JSON.stringify(TogglButton.$latestStoppedEntry)
            );
          }
        }
        if (!PopUp.$header.getAttribute('data-view')) {
          PopUp.switchView(PopUp.$menuView);
        }

        PopUp.renderTimer();
        PopUp.renderEntriesList();
        PopUp.renderSummary();
      } else {
        localStorage.setItem('latestStoppedEntry', '');
        PopUp.switchView(PopUp.$loginView);
      }
    } catch (e) {
      browser.runtime.sendMessage({
        type: 'error',
        stack: e.stack,
        category: 'Popup'
      });
    }
  },

  renderTimer: function () {
    const rootElement = document.getElementById('root-timer');
    ReactDOM.unmountComponentAtNode(rootElement);
    const entry = TogglButton.$curEntry;
    ReactDOM.render(<Timer entry={entry} />, rootElement);
  },

  sendMessage: function (request) {
    return browser.runtime.sendMessage(request)
      .then(async function (response) {
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
          const showPostPopup = await browser.extension.getBackgroundPage().db.get('showPostPopup');
          if (!!response.type && response.type === 'New Entry' && showPostPopup) {
            PopUp.updateEditForm(PopUp.$editView);
          } else if (response.type === 'Update') {
            TogglButton = browser.extension.getBackgroundPage().TogglButton;
          } else {
            window.location.reload();
            // PopUp.renderTimer();
            // PopUp.renderEntriesList();
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

  showError: function (errorMessage) {
    PopUp.$errorLabel.textContent = errorMessage;
    PopUp.$errorLabel.classList.add('show');
    setTimeout(function () {
      PopUp.$errorLabel.classList.remove('show');
    }, 3000);
  },

  renderSummary: function () {
    const sums = TogglButton.calculateSums();

    document.querySelector('.summary .s-today > span').textContent = sums.today;
    document.querySelector('.summary .s-week > span').textContent = sums.week;
  },

  renderEntriesList: function () {
    const html = document.createElement('div');
    const entries = TogglButton.$user.time_entries;
    if (!entries || entries.length < 1) {
      return;
    }

    const { listEntries, projects } = [...entries].reverse().reduce((sum, entry) => {
      if (sum.listEntries.length >= 5) return sum;

      const exists = sum.listEntries.some((te) => te.description === entry.description && te.pid === entry.pid);
      if (!exists) {
        sum.listEntries.push(entry);
      }
      const project = TogglButton.findProjectByPid(entry.pid);
      if (project) {
        sum.projects[project.id] = project;
      }
      return sum;
    }, { listEntries: [], projects: {} });

    if (!listEntries.length) {
      return;
    }

    // Remove old html
    while (PopUp.$entries.firstChild) {
      PopUp.$entries.removeChild(PopUp.$entries.firstChild);
    }

    // Render react tree
    html.id = 'root-time-entries-list';
    PopUp.$entries.appendChild(html);
    ReactDOM.render(<TimeEntriesList timeEntries={listEntries} projects={projects} />, document.getElementById('root-time-entries-list'));
  },

  setTagIcon: function (tags) {
    const t = !!tags && !!tags.length;
    const joinedTags = t ? tags.join(', ') : '';

    PopUp.$timerRow.classList.toggle('tag-icon-visible', t);
    PopUp.$tagIcon.setAttribute('title', joinedTags);
  },

  switchView: function (view) {
    PopUp.$header.setAttribute('data-view', view.id);
  },

  formatMe: function (n) {
    return n < 10 ? '0' + n : n;
  },

  msToTime: function (duration) {
    let seconds = parseInt((duration / 1000) % 60, 10);
    let minutes = parseInt((duration / (1000 * 60)) % 60, 10);
    let hours = parseInt(duration / (1000 * 60 * 60), 10);

    hours = hours < 10 ? '0' + hours : hours;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;

    return hours + ':' + minutes + ':' + seconds;
  },

  /* Edit form functions */
  updateEditForm: function (view) {
    const pid = TogglButton.$curEntry.pid ? TogglButton.$curEntry.pid : 0;
    const tid = TogglButton.$curEntry.tid ? TogglButton.$curEntry.tid : 0;
    const wid = TogglButton.$curEntry.wid;
    const togglButtonDescription = document.querySelector(
      '#toggl-button-description'
    );
    const togglButtonDuration = document.querySelector('#toggl-button-duration');

    togglButtonDescription.value = TogglButton.$curEntry.description
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

  updateBillable: function (pid, noOverwrite) {
    let project;
    let i;
    let pwid = TogglButton.$user.default_wid;
    const ws = TogglButton.$user.workspaces;
    let premium;

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

    if (!noOverwrite && (pid !== 0 && project.billable)) {
      PopUp.$billable.classList.toggle('tb-checked', true);
    }
  },

  // Duration changed let's calculate new start
  getStart: function () {
    const arr = document.querySelector('#toggl-button-duration').value.split(':');

    if (!PopUp.isNumber(arr.join(''))) {
      return false;
    }

    const duration = 1000 * (arr[2] || 0) + 60000 * arr[1] + 3600000 * arr[0];

    const now = new Date();
    return new Date(now.getTime() - duration);
  },

  isNumber: function (n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  },

  toggleBillable: function (visible) {
    const tabIndex = visible ? '103' : '-1';
    PopUp.$billable.setAttribute('tabindex', tabIndex);
    PopUp.$billable.classList.toggle('no-billable', !visible);
  },

  setupBillable: function (billable, pid) {
    PopUp.updateBillable(pid, true);
    PopUp.$billable.classList.toggle('tb-checked', billable);
  },

  submitForm: function (that) {
    if (!this.isformValid()) {
      return;
    }
    const selected = PopUp.$projectAutocomplete.getSelected();

    const billable = !!document.querySelector(
      '.tb-billable.tb-checked:not(.no-billable)'
    );

    const request = {
      type: 'update',
      description: document.querySelector('#toggl-button-description').value,
      pid: selected.pid,
      projectName: selected.name,
      tags: PopUp.$tagAutocomplete.getSelected(),
      tid: selected.tid,
      respond: true,
      billable: billable,
      service: 'dropdown'
    };

    const start = PopUp.getStart();

    if (start) {
      request.start = start.toISOString();
      request.duration = -1 * Math.floor(start.getTime() / 1000);
    }

    PopUp.sendMessage(request);
    PopUp.renderTimer();
    PopUp.switchView(PopUp.$menuView);
  },

  isformValid: function () {
    return !!document.querySelector('#toggl-button-edit-form form:valid');
  },

  addEditEvents: function () {
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
      .addEventListener('click', function (e) {
        PopUp.submitForm(this);
      });

    document
      .querySelector('#toggl-button-update')
      .addEventListener('keydown', function (e) {
        if (e.code === 'Enter' || e.code === 'Space') {
          PopUp.submitForm(this);
        }
      });

    document
      .querySelector('#entry-form form')
      .addEventListener('submit', function (e) {
        PopUp.submitForm(this);
        e.preventDefault();
      });

    PopUp.$projectAutocomplete.onChange(function (selected) {
      const project = TogglButton.findProjectByPid(selected.pid);

      const wid = project ? project.wid : TogglButton.$curEntry.wid;

      PopUp.$tagAutocomplete.setWorkspaceId(wid);
    });

    PopUp.$billable.addEventListener('click', function () {
      this.classList.toggle('tb-checked');
    });

    PopUp.$billable.addEventListener('keydown', function (e) {
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
  }
};

document.addEventListener('DOMContentLoaded', function () {
  let onClickSendMessage;
  const req = {
    type: 'sync',
    respond: false
  };

  try {
    PopUp.sendMessage(req);
    PopUp.showPage();
    PopUp.$editButton.addEventListener('click', function () {
      PopUp.updateEditForm(PopUp.$editView);
    });
    onClickSendMessage = function () {
      const request = {
        type: this.getAttribute('data-event'),
        respond: true,
        service: 'dropdown'
      };
      clearInterval(PopUp.$timer);
      PopUp.$timer = null;

      PopUp.sendMessage(request);
    };
    PopUp.$resumeButton.addEventListener('click', onClickSendMessage);

    document
      .querySelector('.header .cog')
      .addEventListener('click', function () {
        const request = {
          type: 'options',
          respond: false
        };

        browser.runtime.sendMessage(request);
      });

    document
      .querySelector('#signin')
      .addEventListener('submit', function (event) {
        event.preventDefault();
        PopUp.$errorLabel.classList.remove('show');
        const request = {
          type: 'login',
          respond: true,
          username: document.querySelector('#login_email').value,
          password: document.querySelector('#login_password').value
        };
        PopUp.sendMessage(request);
      });

    document
      .querySelector('#workspace')
      .addEventListener('submit', function (event) {
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

    PopUp.$entries.addEventListener('click', function (e) {
      if (!e.target.dataset.continueId) {
        return;
      }
      const id = e.target.dataset.continueId;
      const timeEntry = TogglButton.$user.time_entries[id];

      const request = {
        type: 'list-continue',
        respond: true,
        service: 'dropdown-list',
        data: timeEntry
      };

      PopUp.sendMessage(request);
    });
  } catch (e) {
    browser.runtime.sendMessage({
      type: 'error',
      stack: e.stack,
      category: 'Popup'
    });
  }
});
