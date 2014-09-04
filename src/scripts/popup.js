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
      PopUp.toggleEditFormState(TogglButton.$showPostPopup);
    } else {
      document.querySelector("#login-form").style.display = 'block';
    }
  },

  sendMessage: function (request) {
    chrome.extension.sendMessage(request, function (response) {
      if (!!response.success) {
        window.location.reload();
      }
    });
  },

  toggleEditFormState: function (state) {
    var request = {
      type: "toggle-popup",
      state: state
    };
    PopUp.sendMessage(request);
    PopUp.$popUpButton.setAttribute("data-form-enabled", state);
    PopUp.$popUpButton.innerHTML = (state ? "Disable" : "Enable") + PopUp.$postStartText;
  }
};

document.addEventListener('DOMContentLoaded', function () {
  PopUp.$popUpButton = document.querySelector(".popup-button");
  PopUp.$stopButton = document.querySelector(".stop-button");
  PopUp.showPage();

  PopUp.$stopButton.addEventListener('click', function () {
    var request = {
      type: "stop",
      respond: true
    };
    PopUp.sendMessage(request);
  });

  PopUp.$popUpButton.addEventListener('click', function () {
    PopUp.toggleEditFormState(localStorage.getItem("showPostPopup") !== "true");
  });

  document.querySelector(".logout-button").addEventListener('click', function () {
    var request = {
      type: "logout",
      respond: true
    };
    PopUp.sendMessage(request);
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