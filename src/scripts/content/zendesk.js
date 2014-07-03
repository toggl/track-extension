/*jslint indent: 2 */
/*global $: false, document: false, togglbutton: false*/

"use strict";

togglbutton.render('section.ticket:not(.disabled):not(.toggl)', {observe: true}, function (elem) {
	console.log(elem);
	var button,
			link,
			titleElem = $('div.ticket.section input[name="subject"]', elem),
//			container = $('.header', elem),
			container = $('header nav', elem.parentElement),
			projectName = $('title').textContent;

	if (titleElem === null || container === null) {
		return;
	}

	button = createTag('span', 'btn')
	link = togglbutton.createTimerLink({
		className: 'zendesk',
		description: titleElem.value,
		projectName: projectName && projectName.split(' -').shift()
	});
	button.appendChild(link);

	container.appendChild(button);
});
