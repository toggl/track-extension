/*jslint indent: 4 */
/*global window: false, document: false, chrome: false, $: false, createTag: false, createLink: false*/
(function () {
  //"use strict";
	var isStarted = false;

	function createTimerLink(task, moreClass) {
		var link = createLink(moreClass, 'span');
		link.addEventListener("click", function (e) {
			var msg, btnText;

			if(isStarted) {
				msg = {type: 'stop'};
				btnText = 'Start timer';
			} else {
				msg = {
					type: 'timeEntry',
					description: task
				};
				btnText = 'Started...';
			}
			chrome.extension.sendMessage(msg);
			this.innerHTML = btnText;
			isStarted = !isStarted;
		});

		// new button created - reset state
		isStarted = false;

		return link;
	}

	function addLinkToTicket() {
		if ($('.card-detail-metadata') === null) {
		}
		else if ($('.card-detail-metadata > .badges > .toggl-badge') !== null) {
		}
		else {
			var titleElem = $('.window-title-text');
			if (titleElem !== null) {
				var title = titleElem.innerText;
				var wrap = createTag('div', 'badge toggl-badge');
				wrap.appendChild(createTimerLink(title, 'toggl-button trello'));
				$('.card-detail-metadata > .badges').appendChild(wrap);
			}
		}
		window.setTimeout(function() {
			addLinkToTicket();
		}, 500);
	}

	chrome.extension.sendMessage({type: 'activate'}, function (response) {
		if (response.success) {
			addLinkToTicket();
		}
	});

}());
