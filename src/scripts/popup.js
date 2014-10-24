/*jslint indent: 2, unparam: true*/
/*global document: false, window: false, XMLHttpRequest: false, chrome: false, btoa: false, localStorage:false */
"use strict";

var TogglButton = chrome.extension.getBackgroundPage().TogglButton;

var PopUp = {
  $postStartText: " post-start popup",
  $popUpButton: null,
  $stopButton: null,
  showPage: function () {
    if (TogglButton.$user !== null) {
      document.querySelector(".menu").style.display = 'block';
      if (TogglButton.$curEntry === null) {
        PopUp.$stopButton.setAttribute("disabled", true);
      }
    } else {
      document.querySelector("#login-form").style.display = 'block';
    }
  },

  sendMessage: function (request) {
    chrome.extension.sendMessage(request, function (response) {
      if (!!response.success) {
        if (!!response.type && response.type === "Stop") {
          window.close();
        } else {
          window.location.reload();
        }
      }
    });
  }
};

document.addEventListener('DOMContentLoaded', function () {
  PopUp.$stopButton = document.querySelector(".stop-button");
  PopUp.showPage();

  PopUp.$stopButton.addEventListener('click', function () {
    var request = {
      type: "stop",
      respond: true
    };
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

  document.querySelector(".login-btn").addEventListener('click', function () {
    var request = {
      type: "login",
      respond: true,
      username: document.querySelector("#login_email").value,
      password: document.querySelector("#login_password").value
    };
    PopUp.sendMessage(request);
  });
});