/*jslint indent: 2 */
/*global $: false, document: false, togglbutton: false*/

'use strict';

togglbutton.render('.ticket-fields-panel:not(.toggl)', {observe: true}, function (elem) {
  var link, description,
    titleElem = $("h1.summary .number", elem),
    numElem   = $("h1.summary .text-field-text", elem);

  description = titleElem.innerText + ": " + numElem.innerText;

  link = togglbutton.createTimerLink({
    className: 'unfuddle',
    description: description,
  });

  $(".primary-properties", elem).appendChild(link);
});

/*
(function () {
  "use strict";
  var isStarted = false;

  function createTimerElem(ticketDesc) {
    var wrapperElem = createTag("span", "toggl"),
        timerElem   = createLink("toggl-button unfuddle", "span");

    // Append separator:
    wrapperElem.appendChild(createTag("span", "separator", "|"));
    // Append icon:
    wrapperElem.appendChild(createTag("span", "icon icon-time"));
    // Append timer:
    wrapperElem.appendChild(timerElem);

    // Customize timer element styles:
    timerElem.style.cursor      = "pointer";
    timerElem.style.background  = "none";
    timerElem.style.paddingLeft = "4px";

    // Bind a click behavior:
    timerElem.addEventListener("click", function (e) {
      var msg, btnText;

      if(isStarted) {
        msg = {type: 'stop'};
        btnText = 'Start timer';
      } else {
        msg = {
          type: 'timeEntry',
          description: ticketDesc
        };
        btnText = 'Started...';
      }
      chrome.extension.sendMessage(msg);
      this.innerHTML = btnText;
      isStarted = !isStarted;
      return false;
    });

    // new button created - reset state
    isStarted = false;

    return wrapperElem;
  }

  // ------------------------------------------------------------------------

  function addLinkToTicket() {
    // Wait for the page to get completely loaded:
    if ($(".ticket-header") === null) {
      window.setTimeout(function() {
        addLinkToTicket();
      }, 300);

      return;
    }

    // Get ticket title & number:
    var timerElem,
        ticketNum  = $(".ticket-header h1.summary .number").innerText,
        ticketDesc = $(".ticket-header h1.summary .text-field-text").innerText;

    // Create timer element & append it to the ticket header:
    timerElem = createTimerElem(ticketNum + ": " + ticketDesc);
    $(".primary-properties").appendChild(timerElem);
  }

  // ------------------------------------------------------------------------

  chrome.extension.sendMessage({type: "activate"}, function (response) {
    if (response.success) {

      // Initial setup, if currently on a ticket page:
      if (location.hash.indexOf("/by_number/") != -1) {
        addLinkToTicket();
      }

      // Bind a behavior on URI hash change & check if we"re ended on a ticket page:
      window.addEventListener("hashchange", function(e) {
        if (location.hash.indexOf("/by_number/") != -1) {
          addLinkToTicket();
        }
      }, false);

    }
  });

}());

*/
