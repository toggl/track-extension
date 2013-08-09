/* jslint indent: 2 */
/* global window: false, document: false, chrome: false, $: false, createTag: false, createLink: false */

/**
 * Unfuddle integration for Toggl Button Chrome extension.
 *
 * @todo
 * - Detect of the timer for this ticket is already running
 */
(function () {

  "use strict";

  /**
   * Creates timer link.
   *
   * @param  {string} ticketDesc Ticket description.
   *
   * @return {string}
   */
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
      chrome.extension.sendMessage({
        type:        "timeEntry",
        description: ticketDesc
      });

      // When started, link to toggl app:
      timerElem.innerHTML = "<a href="http://toggl.com/" style="color:#333" target="_blank">Timer started...</a>";
      return false;
    });

    return wrapperElem;
  }

  // ------------------------------------------------------------------------

  /**
   * Adds timer link to a discussion.
   *
   * @return {void}
   */
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
