/*jslint indent: 2 */
/*global $: false, document: false, togglbutton: false*/

'use strict';

togglbutton.render('.wrapper:not(.toggl)', {observe: true}, function (elem) {

	var link,
		description = $('.content-header', elem).textContent.trim();

	link = togglbutton.createTimerLink({
		description: description
	});

	link.setAttribute('style', 'margin-left: 15px');

	$('.page-header').appendChild(link);
});