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
				btnText = 'Stop timer';
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


	function addButtonTo(elem) {
	  var alink, stag, cont = $('.checklist-item-details', elem);
	  if (cont === null) {
	    return;
	  }
	  alink = createLink('toggl-button trello-checklist');
	  alink.innerHTML = "";
	  alink.setAttribute("data-behavior", "hover_content");

	  alink.addEventListener("click", function (e) {
	    var msg, btnText, color = '';

	    e.preventDefault();

	    var i, elems = document.querySelectorAll(".trello-checklist");
	    for (i = 0; i < elems.length; i += 1) {
	      !(e.target == elems[i]) && elems[i].classList.remove('active');
	    }

	    if(isStarted) {
	      msg = {type: 'stop'};
	      btnText = '';
	      alink.classList.remove('active');
	    } else {
	      msg = {
	        type: 'timeEntry',
	        description: $('.window-title-text').textContent + " - " + $('.checklist-item-details-text', elem).textContent
	      };
	      btnText = '';
	      color = '#5c5c5c';
	      alink.classList.add('active');
	    }

	    chrome.extension.sendMessage(msg);
	    isStarted = !isStarted;
	    alink.style.color = color;
	    alink.textContent = btnText;
	  });

	  stag = document.createElement("span");
	  cont.parentNode.appendChild(stag.appendChild(alink));

	  // new button created - reset state
	  isStarted = false;
	}

	chrome.extension.sendMessage({type: 'activate'}, function (response) {
		if (response.success) {
			
			addLinkToTicket(); 
			
			var observer, card;

			observer = new MutationObserver(function (mutations) {
			  var i, elems = document.querySelectorAll(".checklist-item:not(.toggl)");
			  for (i = 0; i < elems.length; i += 1) {
			    elems[i].classList.add('toggl');
			    addButtonTo(elems[i]);
			  }
  			});

			card = document.querySelector('.window-wrapper');
			observer.observe(card, {childList: true, subtree: true});
			// Trigger the mutation observer for initial setup
			setTimeout(card.appendChild(document.createElement('a')), 500);
		}
	});

}());
