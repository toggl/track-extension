import React from 'react';
import ReactDOM from 'react-dom';
import { isSameDay } from 'date-fns';

import { secToHhmmImproved } from './@toggl/time-format-utils';
import Summary from './components/Summary';
import TimeEntriesList from './components/TimeEntriesList';
import Timer, { formatDuration } from './components/Timer';
import { ProjectAutoComplete, TagAutoComplete } from './lib/autocomplete';
import { parseDuration } from './lib/timerUtils';
import renderLogin from './initializers/login';

const browser = require('webextension-polyfill');

let TogglButton = browser.extension.getBackgroundPage().TogglButton;
const FF = navigator.userAgent.indexOf('Chrome') === -1;

const ENTRIES_LIST_LIMIT = 15;

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
  $loginView: document.querySelector('#login-view'),
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
        } else {
          PopUp.showCurrentDuration(true);
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

  renderSummary: function () {
    const rootElement = document.getElementById('root-summary');
    ReactDOM.unmountComponentAtNode(rootElement);
    ReactDOM.render(<Summary />, rootElement);
  },

  renderTimer: function () {
    const rootElement = document.getElementById('root-timer');
    const entry = TogglButton.$curEntry;
    const project = entry && TogglButton.findProjectByPid(entry.pid) || null;
    ReactDOM.render(<Timer entry={entry} project={project} />, rootElement);
  },

  sendMessage: function (request) {
    if (process.env.DEBUG) {
      console.info('Popup:sendMessage', request);
    }
    return browser.runtime.sendMessage(request)
      .then(function (response) {
        if (process.env.DEBUG) {
          console.info('Popup:sendMessageResponse', response, request);
        }

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
          if (response.type === 'Update') {
            // Extension update?
            TogglButton = browser.extension.getBackgroundPage().TogglButton;
            // Current TE update
            PopUp.renderTimer();
          } else if (response.type === 'update') {
            // Current TE update
            PopUp.renderTimer();
          } else if (response.type === 'Stop') {
            PopUp.renderTimer();
            PopUp.renderEntriesList();
            PopUp.renderSummary();
          } else if (response.type === 'list-continue' || response.type === 'New Entry') {
            PopUp.renderTimer();
            PopUp.renderEntriesList();
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

  showError: function (errorMessage) {
    PopUp.$errorLabel.textContent = errorMessage;
    PopUp.$errorLabel.classList.add('show');
    setTimeout(function () {
      PopUp.$errorLabel.classList.remove('show');
    }, 3000);
  },

  renderEntriesList: function () {
    const entries = TogglButton.$user.time_entries;
    if (!entries || entries.length < 1) {
      return;
    }

    const hasExistingGroup = (entry) => ([te]) => {
      return isSameDay(te.start, entry.start) &&
        te.description === entry.description &&
        te.pid === entry.pid &&
        (te.tags || []).join(',') === (entry.tags || []).join(',') &&
        te.billable === entry.billable;
    };

    // Transform entries into an ordered list of grouped time entries
    const { listEntries, projects } = [...entries].reverse().reduce((sum, entry) => {
      // Exclude running TE.
      if (entry.duration < 0) {
        return sum;
      }

      const existingGroupIndex = sum.listEntries.findIndex(hasExistingGroup(entry));
      if (existingGroupIndex === -1) {
        // This TE group has not been seen yet.
        if (sum.listEntries.length >= ENTRIES_LIST_LIMIT) return sum;
        sum.listEntries.push([entry]);
      } else {
        // This TE group already exists.
        sum.listEntries[existingGroupIndex].push(entry);
        sum.listEntries[existingGroupIndex].sort((a, b) => {
          // Most recent entries first.
          if (a.start > b.start) return -1;
          if (b.start > a.start) return 1;
          return 0;
        });
      }

      const project = TogglButton.findProjectByPid(entry.pid);
      if (project) sum.projects[project.id] = project;
      return sum;
    }, { listEntries: [], projects: {} });

    if (!listEntries.length) {
      return;
    }

    // Render react tree
    ReactDOM.render(<TimeEntriesList timeEntries={listEntries} projects={projects} />, document.getElementById('root-time-entries-list'));
  },

  switchView: function (view) {
    if (view === PopUp.$loginView) {
      renderLogin(PopUp.$loginView, true);
    }
    PopUp.$header.setAttribute('data-view', view.id);
  },

  formatMe: function (n) {
    return n < 10 ? '0' + n : n;
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
    togglButtonDuration.value = secToHhmmImproved(
      new Date() - new Date(TogglButton.$curEntry.start),
      { html: false }
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
    PopUp.showCurrentDuration(true);
  },

  showCurrentDuration: function (startTimer) {
    if (TogglButton.$curEntry === null) {
      return;
    }

    const duration = formatDuration(TogglButton.$curEntry.start);
    const durationField = document.querySelector('#toggl-button-duration');

    // Update edit form duration field
    if (PopUp.durationChanged === false) {
      durationField.value = duration;
    }

    if (startTimer) {
      if (!PopUp.$timer) {
        PopUp.$timer = setInterval(function () {
          PopUp.showCurrentDuration();
        }, 1000);
      }
    }
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

  isNumber: function (n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  },

  toggleBillable: function (visible) {
    const tabIndex = visible ? '0' : '-1';
    PopUp.$billable.setAttribute('tabindex', tabIndex);
    PopUp.$billable.classList.toggle('no-billable', !visible);
  },

  setupBillable: function (billable, pid) {
    PopUp.updateBillable(pid, true);
    PopUp.$billable.classList.toggle('tb-checked', billable);
  },

  submitForm: function () {
    // Translate human duration input if submitted without blurring
    const $duration = document.querySelector('#toggl-button-duration');
    let duration = $duration.value;
    if (duration) {
      duration = parseDuration(duration).asSeconds();
      $duration.value = secToHhmmImproved(duration, { html: false });
    }

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

    if (duration) {
      const start = new Date((new Date()).getTime() - duration * 1000);
      request.start = start.toISOString();
      request.duration = -1 * Math.floor(start.getTime() / 1000);
    }

    PopUp.sendMessage(request);
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

    document
      .querySelector('#toggl-button-project-placeholder')
      .closest('.Dialog__field')
      .addEventListener('focus', (e) => {
        PopUp.$projectAutocomplete.openDropdown();
      });
    document
      .querySelector('#toggl-button-tag-placeholder')
      .closest('.Dialog__field')
      .addEventListener('focus', (e) => {
        PopUp.$tagAutocomplete.openDropdown();
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
      .querySelector('.header .sync-data')
      .addEventListener('click', function () {
        const request = { type: 'sync' };
        browser.runtime.sendMessage(request);
        browser.extension.getBackgroundPage().ga.report('sync', 'sync-toolbar-popup');
      });

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

    document
      .querySelector('#toggl-button-duration')
      .addEventListener('keydown', function (event) {
        // Doesn't cover all cases; can't really do it without introducing more state.
        // Need a refactor.
        if (event.code !== 'Enter' && event.code !== 'Tab') {
          PopUp.durationChanged = true;
        }
      });
    document
      .querySelector('#toggl-button-duration')
      .addEventListener('blur', function (event) {
        const value = event.target.value || '';
        const parsedInput = parseDuration(value).asSeconds();
        event.target.value = secToHhmmImproved(parsedInput, { html: false });
      });

    PopUp.$entries.addEventListener('click', function (e) {
      if (!e.target.dataset.continueId) {
        return;
      }
      const id = e.target.dataset.continueId;
      const timeEntry = TogglButton.$user.time_entries.find((entry) => entry.id === +id);

      const request = {
        type: 'list-continue',
        respond: true,
        service: 'dropdown-list',
        data: timeEntry
      };

      PopUp.sendMessage(request);
      window.scrollTo(0, 0);
    });
  } catch (e) {
    browser.runtime.sendMessage({
      type: 'error',
      stack: e.stack,
      category: 'Popup'
    });
  }
});
