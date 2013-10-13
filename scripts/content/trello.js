/*jslint indent: 2 */
/*global window: false, document: false, chrome: false, $: false, createTag: false, createLink: false*/
(function () {
  //"use strict";
	function createTimerLink(task, moreClass) {
		var link = createLink(moreClass, 'span');
		link.addEventListener("click", function (e) {
			chrome.extension.sendMessage({
				type: 'timeEntry',
				description: task
			});
			this.innerHTML = "Started...";
			this.removeEventListener('click', arguments.callee, false);
			this.addEventListener("click", function (e) {
				alert('Already started!');
			});
		});
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
