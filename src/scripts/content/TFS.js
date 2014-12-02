/*jslint indent: 2 */
/*global $: false, document: false, togglbutton: false, createTag:false*/

'use strict';

togglbutton.render('.toolbar:not(.toggl)', {observe: true}, function (elem) {

window.setTimeout("createTFSButton()", 1000);

});

function createTFSButton(){
	var link,
    projectElem = $('.project-name'),
    togglElem = document.querySelectorAll('.toolbar'),
    descriptionElem = document.querySelectorAll('.info-text-wrapper')
	

  link = togglbutton.createTimerLink({
    className: 'tfsTogglButton',
    description: descriptionElem[descriptionElem.length-1].childNodes[0].innerText + " " + descriptionElem[descriptionElem.length-1].childNodes[1].innerText ,
    projectName: projectElem.innerText
  });
  
togglElem[togglElem.length-1].firstChild.appendChild(link);
var bla = createTag('div', 'empty')
var a = createTag('a', 'emptylink')
var findWhere = document.querySelectorAll('.workitem-info-bar') 
if(findWhere[findWhere.length-1].innerHTML.indexOf('class="empty"') == -1){
findWhere[findWhere.length-1].insertBefore(bla, descriptionElem[descriptionElem.length-1]);
var findNew = document.querySelectorAll('.empty') 
findNew[findNew.length-1].appendChild(a);
var findNewLink = document.querySelectorAll('.emptylink')
findNewLink[findNewLink.length-1].setAttribute("href", "javascript:void()");
findNewLink[findNewLink.length-1].innerHTML = "&nbsp;";
findNew[findNew.length-1].setAttribute("style", "float:left");
}
var findLastInput = document.querySelectorAll('.wit-font-size-large > div > div > input')
findLastInput[findLastInput.length-1].addEventListener('blur', reCreateButton, false);

if (togglElem[togglElem.length-1].innerHTML.indexOf('class="toggl-button tfsTogglButton"') == -1){window.setTimeout("reCreateButton()", 1000);}
}

function reCreateButton(){
	var togglElem =  document.querySelectorAll('.toolbar')
	if(togglElem[togglElem.length-1].innerHTML.indexOf('class="toggl-button tfsTogglButton"') > -1){ 
		togglElem[togglElem.length-1].innerHTML = togglElem[togglElem.length-1].innerHTML.replace('<a class="toggl-button tfsTogglButton" href="#">Start timer</a>','');
		togglElem[togglElem.length-1].innerHTML = togglElem[togglElem.length-1].innerHTML.replace('<a class="toggl-button tfsTogglButton" href="#">Stop timer</a>','');
	}
	var findLastInput = document.querySelectorAll('.wit-font-size-large > div > div > input')
	findLastInput[findLastInput.length-1].removeEventListener ("blur", reCreateButton, false);
	window.setTimeout("createTFSButton()", 100);
}


