/*jslint indent: 2 */
/*global $: false, document: false, togglbutton: false, createTag:false*/

'use strict';

var checkTimer,
	timeWait = 10;
window.MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;

var observer = new MutationObserver(function(mutation) {
		var obj = arguments[0][0].target;
		window.clearTimeout(checkTimer);
		checkTimer = window.setTimeout(function() {
			createTFSButton(obj);
		}, timeWait);
	}),
	config = {
		attributes: true
	};

togglbutton.render('.workitem-info-bar:not(.toggl)', {
	observe: true
}, function(elem) {

	var target = document.querySelectorAll('.workitem-info-bar'),
		y;

	checkTimer = window.setTimeout(function() {
		createTFSButton(target[0]);
	}, timeWait);

	for (y = 0; y < target.length; y++) {
		createObserver(target[y]);
	}

	// observer.disconnect();
});

function createObserver(element) {

	observer.observe(element, config);
}

function createTFSEvilHackElement(hackElement, titleHolder) {
	var div = createTag('div', 'empty');
	var a = createTag('a', 'emptylink');
	var where = hackElement;
	var title = titleHolder;
	if (where.innerHTML.indexOf('class="emptylink"') == -1) {
		where.insertBefore(div, title);
		var findNew = where.querySelector('.empty');
		findNew.appendChild(a);
		var findNewLink = where.querySelector('.emptylink');
		findNewLink.setAttribute("href", "javascript:void()");
		findNewLink.innerHTML = "&nbsp;";
		findNew.setAttribute("style", "float:left");
	}
}

function createTFSButton(homeElement) {
	var x, y, link,
		projectElem = $('.project-name'),
		togglElem = document.querySelectorAll('.toolbar'),
		descriptionElem = document.querySelectorAll('.workitem-info-bar'),
		descriptionTitle = "",
		home, titleHolder

	home = homeElement;
	if (home.innerHTML != "") {
		titleHolder = home.querySelector('.info-text-wrapper');

		descriptionTitle = titleHolder.childNodes[0].innerText + " " + titleHolder.childNodes[1].innerText;


		link = togglbutton.createTimerLink({
			className: 'tfsTogglButton',
			description: descriptionTitle,
			projectName: projectElem.innerText
		});

		var toolbars = home.parentNode.querySelectorAll('.toolbar');
		if (toolbars.length == 0) {
			toolbars = home.parentNode.parentNode.querySelectorAll('.toolbar');
		}
		for (y = 0; y < toolbars.length; y++) {
			removeButton(toolbars[y]);
			toolbars[y].firstChild.appendChild(link);

		}
		createTFSEvilHackElement(home, titleHolder);
	}

}

function removeButton(toolbarElement) {
	if (toolbarElement.innerHTML.indexOf('class="toggl-button tfsTogglButton') > -1) {
		var lastNode = toolbarElement.childNodes[0].lastChild;
		if (lastNode.innerHTML.indexOf('timer') > -1) {
			toolbarElement.childNodes[0].removeChild(lastNode)
		}
	}
}