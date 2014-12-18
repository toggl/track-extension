/*jslint indent: 2 */
/*global $: false, document: false, togglbutton: false, createTag:false*/

'use strict';

var checkTimer;

togglbutton.render('.toolbar:not(.toggl)', {
	observe: true
}, function(elem) {

	checkTimer = window.setTimeout("createTFSButton()", 1000);

});

function createTFSEvilHackElement() {
	var bla = createTag('div', 'empty')
	var a = createTag('a', 'emptylink')
	var evilHackElement = document.querySelectorAll('.info-text-wrapper')
	var findWhere = document.querySelectorAll('.workitem-info-bar')
	if (findWhere[findWhere.length - 1].innerHTML.indexOf('class="empty"') == -1) {
		findWhere[findWhere.length - 1].insertBefore(bla, evilHackElement[evilHackElement.length - 1]);
		var findNew = document.querySelectorAll('.empty')
		findNew[findNew.length - 1].appendChild(a);
		var findNewLink = document.querySelectorAll('.emptylink')
		findNewLink[findNewLink.length - 1].setAttribute("href", "javascript:void()");
		findNewLink[findNewLink.length - 1].innerHTML = "&nbsp;";
		findNew[findNew.length - 1].setAttribute("style", "float:left");
	}
}

function createTFSButton() {
	var x, link,
		projectElem = $('.project-name'),
		togglElem = document.querySelectorAll('.toolbar'),
		descriptionElem = document.querySelectorAll('.workitem-info-bar'),
		descriptionTitle = ""

	var findLastInput = document.querySelectorAll('.wit-font-size-large > div > div > input')
	if (findLastInput.length !== 0) {
		findLastInput[findLastInput.length - 1].addEventListener('blur', reCreateButton, false);
		var titleName = findLastInput[findLastInput.length - 1].value;

		for (x = 0; x < descriptionElem.length; x++) {
			if (descriptionElem[x].getAttribute("title") === titleName) {
				var descElem = descriptionElem[x].childNodes[0];
				if (descElem.innerHTML.indexOf('info-text') == -1) {
					descElem = descriptionElem[x].childNodes[1];
				}
				descriptionTitle = descElem.childNodes[0].innerText + " " + descElem.childNodes[1].innerText
			}
		}

		link = togglbutton.createTimerLink({
			className: 'tfsTogglButton',
			description: descriptionTitle,
			projectName: projectElem.innerText
		});

		togglElem[togglElem.length - 1].firstChild.appendChild(link);

		createTFSEvilHackElement();
	}

	if (togglElem[togglElem.length - 1].innerHTML.indexOf('class="toggl-button tfsTogglButton"') == -1) {
		window.clearTimeout(checkTimer);
		checkTimer = window.setTimeout("reCreateButton()", 1000);
	}
}

function reCreateButton() {
	var togglElem = document.querySelectorAll('.toolbar')
	if (togglElem[togglElem.length - 1].innerHTML.indexOf('class="toggl-button tfsTogglButton') > -1) {
		var lastNode = togglElem[togglElem.length - 1].childNodes[0].lastChild;
		if (lastNode.innerHTML.indexOf('timer') > -1) {
			togglElem[togglElem.length - 1].childNodes[0].removeChild(lastNode)
		}
	}
	var findLastInput = document.querySelectorAll('.wit-font-size-large > div > div > input')
	if (findLastInput.length > 0) {
		findLastInput[findLastInput.length - 1].removeEventListener("blur", reCreateButton, false);
	}
	window.clearTimeout(checkTimer);
	checkTimer = window.setTimeout("createTFSButton()", 10);
}