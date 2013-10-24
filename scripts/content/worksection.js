/*jslint indent: 2 */
/*global window: false, document: false, chrome: false, $: false, createTag: false, createLink: false*/
(function () {
	"use strict";
	function createTimerLink(task, moreClass) {
		var link = createLink(moreClass);
		link.addEventListener("click", function (e) {
			chrome.extension.sendMessage({
				type: 'timeEntry',
				description: task
			});
			var span = createTag('span', 'norm', 'Started...');
			span.title = 'Already started!';
			this.parentNode.replaceChild(span, this);
			return false;
		});
		return link;
	}
	
	function addLinkToTask() {
		if ($('#tasks > .task > #tmenu2') === null) {
			return;
		}
		var projectElem = $('#client_name a');
		var taskElem = $('#tasks > .task > .bold');
		if ( (projectElem !== null) && (taskElem !== null) ) {
			var taskElem_clone = taskElem.cloneNode(true);
			taskElem_clone.removeChild(taskElem_clone.querySelector('a'));
			var task = taskElem_clone.innerText.trim();
			var project = projectElem.innerText.trim();
			console.log(task);
			var wrap = createTimerLink(project + ' | ' + task, 'worksection norm thickbox wsinit');
			$('#tmenu2').insertBefore(wrap, $('#tmenu2').firstChild);
		}
	}

	chrome.extension.sendMessage({type: 'activate'}, function (response) {
		if (response.success) {
			addLinkToTask();
		}
	});

}());
