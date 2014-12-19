/*jslint indent: 2 */
/*global $: false, document: false, togglbutton: false, createTag:false*/

'use strict';

var checkTimer;
window.MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;

togglbutton.render('.workitem-info-bar:not(.toggl)', {
	observe: true
}, function(elem) {

	checkTimer = window.setTimeout("createTFSButton()", 1000);
	// Find the element that you want to "watch"
	var target = document.querySelector('.workitem-info-bar'),
		// create an observer instance
		observer = new MutationObserver(function(mutation) {
			var obj = arguments[0][0].target;
			window.clearTimeout(checkTimer);
			checkTimer = window.setTimeout(function() {
				createTFSButton(obj);
			}, 1000);
		}),
		// configuration of the observer:
		config = {
			attributes: true // this is to watch for attribute changes.
		};
	// pass in the element you wanna watch as well as the options
	observer.observe(target, config);
	// later, you can stop observing
	// observer.disconnect();
});

function createTFSEvilHackElement() {

}


function createTFSButton() {
	var x, y, link,
		projectElem = $('.project-name'),
		togglElem = document.querySelectorAll('.toolbar'),
		descriptionElem = document.querySelectorAll('.workitem-info-bar'),
		descriptionTitle = "",
		home, titleHolder

	home = arguments[0];
	titleHolder = home.childNodes[0];

	descriptionTitle = titleHolder.childNodes[0].innerText + " " + titleHolder.childNodes[1].innerText


	//var allForms = document.querySelectorAll('.work-item-form');
	//for (y = 0; y < allForms.length; y++) {
	//}
	link = togglbutton.createTimerLink({
		className: 'tfsTogglButton',
		description: descriptionTitle,
		projectName: projectElem.innerText
	});

	var toolbars = home.parentNode.querySelectorAll('.toolbar');
	for (y = 0; y < toolbars.length; y++) {
		toolbars[y].firstChild.appendChild(link);
	}

	/*var bla = createTag('div', 'empty')
	var a = createTag('a', 'emptylink')
	var evilHackElement = form.querySelectorAll('.info-text-wrapper')
	var findWhere = form.querySelectorAll('.workitem-info-bar')
	if (findWhere != undefined) {
		if (findWhere[findWhere.length - 1].innerHTML.indexOf('class="empty"') == -1) {
			findWhere[findWhere.length - 1].insertBefore(bla, evilHackElement[evilHackElement.length - 1]);
			var findNew = form.querySelectorAll('.empty')
			findNew[findNew.length - 1].appendChild(a);
			var findNewLink = form.querySelectorAll('.emptylink')
			findNewLink[findNewLink.length - 1].setAttribute("href", "javascript:void()");
			findNewLink[findNewLink.length - 1].innerHTML = "&nbsp;";
			findNew[findNew.length - 1].setAttribute("style", "float:left");
		}
	}*/

}

//createTFSEvilHackElement();

/*if (togglElem[togglElem.length - 1].innerHTML.indexOf('class="toggl-button tfsTogglButton"') == -1) {
	window.clearTimeout(checkTimer);
	checkTimer = window.setTimeout("reCreateButton()", 1000);
}*/


function reCreateButton() {
	var togglElem = document.querySelectorAll('.toolbar')
	var y;
	for (y = 0; y < togglElem.length; y++) {
		if (togglElem[y].innerHTML.indexOf('class="toggl-button tfsTogglButton') > -1) {
			var lastNode = togglElem[y].childNodes[0].lastChild;
			if (lastNode.innerHTML.indexOf('timer') > -1) {
				togglElem[y].childNodes[0].removeChild(lastNode)
			}
		}
	}
	var findLastInput = document.querySelectorAll('.wit-font-size-large > div > div > input')
	for (y = 0; y < findLastInput.length; y++) {

		findLastInput[y].removeEventListener("blur", reCreateButton, false);
	}
	window.clearTimeout(checkTimer);
	checkTimer = window.setTimeout("createTFSButton()", 10);
}