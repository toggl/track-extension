/*jslint indent: 2 */
/*global $: false, document: false, togglbutton: false, createTag:false*/

'use strict';

togglbutton.render('.toolbar:not(.toggl)', {observe: true}, function (elem) {

window.setTimeout("createTFSButton()", 1000);

});
var oldHTML = "";
function createTFSButton(){


	var link,
    projectElem = $('.project-name'),
    descriptionElem = document.querySelectorAll('.toolbar')

  link = togglbutton.createTimerLink({
    className: 'trello',
    description: $('.info-text-wrapper > a').innerText + " " + $('.info-text-wrapper > span').innerText, //descriptionElem[descriptionElem.length-1].parentNode.parentNode.parentNode.firstChild.firstChild.innerText,
    projectName: projectElem.innerText
  });
descriptionElem[descriptionElem.length-1].firstChild.appendChild(link);
var bla = createTag('div', 'empty')
var a = createTag('a', 'emptylink')
$('.workitem-info-bar').insertBefore(bla, $(".info-text-wrapper"));
$('.empty').appendChild(a);
$('.emptylink').setAttribute("href", "#");
$('.emptylink').innerHTML = "&nbsp;";
$('.empty').setAttribute("style", "float:left");

}

