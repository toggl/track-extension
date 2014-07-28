/*jslint indent: 2 */
/*global document: false, chrome: false, $: false, createLink: false, MutationObserver: false*/

(function () {
  "use strict";
  var selectedProjectId = null, selectedProjectBillable = false, isStarted = false;

  function createTimerLink(description, projectName) {
    var link = createLink('toggl-button zendesk');
    link.addEventListener("click", function (e) {
      var msg, btnText, color = '';

      if (isStarted) {
        msg = {type: 'stop'};
        btnText = 'Start Timer';
      } else {
        msg = {
          type: 'timeEntry',
          description: description,
          projectName: projectName,
          projectId: selectedProjectId,
          billable: selectedProjectBillable
        };
        color = '#1ab351';
        btnText = 'Stop Timer';
      }
      chrome.extension.sendMessage(msg);
      link.innerHTML = btnText;
      link.style.color = color;
      isStarted = !isStarted;
	  
	  e.preventDefault()
	  
      return false;
    });

    // new button created - reset state
    isStarted = false;

    return link;
  }

  chrome.extension.sendMessage({type: 'activate'}, function (response) {
    if (response.success) {
		var observer
		observer = new MutationObserver(function (mutations) {

			var titleElem, taskElem, title, wrap, ticketNo, url;

			titleElem = document.getElementsByClassName('pane_header')[0]	

			//Check to see we're not already there
			if (document.getElementsByClassName('toggl-button')[0]) {
				return;
			}
			
			// Check the title panel has loaded
			if (titleElem === null ) {
			  return;
			} 
			
			// Check we have a title 
			if (document.getElementsByClassName('ticket-title')) {
				if (document.getElementsByClassName('ticket-title')[0]) {
					title = document.getElementsByClassName('ticket-title')[0].textContent;
				} else {
					return;
				}
			} else {
				return;
			}
			
			// Work our ticket number from URL (more reliable than anywhere else!)
			url = window.location.href;
			ticketNo = url.substring(url.lastIndexOf('/tickets/')+9);
												
			//Ok, we have a title, stop monitoring the page or we'll catch our own edit 			
			observer.disconnect();

			// Add the button
			wrap = createTag('div', 'toggl');
			wrap.appendChild(createTimerLink('Zendesk Ticket #'+ticketNo+'- ' + title, 'Zendesk Ticket'));			
		    titleElem.insertBefore(wrap,titleElem.previousChild);
			
			//Start Monitoring for mutations again
			observer.observe(document.body, {childList: true, subtree: true});
		});
		
		observer.observe(document.body, {childList: true, subtree: true});

    }
  });


}());
