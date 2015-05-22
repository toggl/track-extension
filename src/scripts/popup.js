/*jslint indent: 2, unparam: true*/
/*global document: false, window: false, XMLHttpRequest: false, chrome: false, btoa: false, localStorage:false */
"use strict";

var TogglButton = chrome.extension.getBackgroundPage().TogglButton;

var PopUp = {
  $postStartText: " post-start popup",
  $popUpButton: null,
  $togglButton: null,
  $error: null,
  $timer: null,
  showPage: function () {
    if (TogglButton.$user !== null) {
      document.querySelector(".user-email").textContent = TogglButton.$user.email;
      document.querySelector(".menu").style.display = 'block';
      if (TogglButton.$curEntry === null) {
        PopUp.$togglButton.setAttribute('data-event', 'timeEntry');
        PopUp.$togglButton.textContent = 'Start timer';
      } else {
        PopUp.$togglButton.setAttribute('data-event', 'stop');
        PopUp.showCurrentDuration(true);
      }
    } else {
      document.querySelector("#login-form").style.display = 'block';
    }
  },

  sendMessage: function (request) {
    chrome.extension.sendMessage(request, function (response) {
      if (!!response.success) {
        if (!!response.type && (response.type === "Stop" || response.type === "New Entry")) {
          window.close();
        } else {
          window.location.reload();
        }
      } else if (request.type === "login") {
        PopUp.$error.style.display = 'block';
      }
    });
  },

  showCurrentDuration: function (startTimer) {
    if (TogglButton.$curEntry === null) {
      PopUp.$togglButton.setAttribute('data-event', 'timeEntry');
      PopUp.$togglButton.textContent = 'Start timer';
      clearInterval(PopUp.$timer);
      PopUp.$timer = null;
      return;
    }

    var duration = PopUp.msToTime(new Date() - new Date(TogglButton.$curEntry.start));

    PopUp.$togglButton.textContent = 'Stop timer   [' + duration + ']';
    if (startTimer) {
      PopUp.$timer = setInterval(function () { PopUp.showCurrentDuration(); }, 1000);
    }
  },

  formatMe: function (n) {
    return (n < 10) ? '0' + n : n;
  },

  msToTime: function (duration) {
    var seconds = parseInt((duration / 1000) % 60, 10),
      minutes = parseInt((duration / (1000 * 60)) % 60, 10),
      hours = parseInt((duration / (1000 * 60 * 60)) % 24, 10);

    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;

    return hours + ":" + minutes + ":" + seconds;
  }
};

document.addEventListener('DOMContentLoaded', function () {
  PopUp.$togglButton = document.querySelector(".stop-button");
  PopUp.$error = document.querySelector(".error");
  PopUp.showPage();

  PopUp.$togglButton.addEventListener('click', function () {
    var request = {
      type: this.getAttribute('data-event'),
      respond: true
    };

    if (request.type === 'timeEntry') {
      request.description = 'Chrome';
    } else {
      clearInterval(PopUp.$timer);
      PopUp.$timer = null;
    }

    PopUp.sendMessage(request);
  });

  document.querySelector(".settings-button").addEventListener('click', function () {
    chrome.tabs.create({url: "html/settings.html"});
  });

  document.querySelector(".logout-button").addEventListener('click', function () {
    var request = {
      type: "logout",
      respond: true
    };
    PopUp.sendMessage(request);
  });

  document.querySelector(".sync-button").addEventListener('click', function () {
    var request = {
      type: "sync",
      respond: false
    };
    PopUp.sendMessage(request);
    window.close();
  });

  document.querySelector("#signin").addEventListener('submit', function (event) {
    event.preventDefault();
    PopUp.$error.style.display = 'none';
    var request = {
      type: "login",
      respond: true,
      username: document.querySelector("#login_email").value,
      password: document.querySelector("#login_password").value
    };
    PopUp.sendMessage(request);
  });

  document.querySelector(".header").addEventListener('click', function () {
    chrome.tabs.create({url: "https://toggl.com/app"});
  });
});