/*jslint indent: 2 */
/*global $: false, document: false, togglbutton: false, createTag:false*/

'use strict';

togglbutton.render('.workitem-tool-bar:not(.toggl)', {observe: true}, function (elem) {

window.setTimeout("createTFSButton()", 1000);

});

function createTFSButton(){


	var link,
    projectElem = $('.project-name'),
    descriptionElem = document.querySelectorAll('.workitem-tool-bar')

  link = togglbutton.createTimerLink({
    className: 'trello',
    description: descriptionElem[descriptionElem.length-1].parentNode.parentNode.parentNode.firstChild.firstChild.innerText,
    projectName: projectElem.innerText
  });
descriptionElem[descriptionElem.length-1].firstChild.appendChild(link);

}

