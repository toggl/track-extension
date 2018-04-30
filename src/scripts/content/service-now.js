/*jslint indent: 2 */
/*global $: false, document: false, togglbutton: false*/
'use strict';

// Inject into iframe load event for main panel
if( document.getElementById('gsft_main') ){
	
	// On load of frame do below
	document.getElementById('gsft_main').onload = function() {
		
		// check page for iframes
		for (var j=0; j<document.getElementsByTagName('iframe').length; j++) {
			
			// select the main panel iframe by id: "gsft_main"
			if( document.getElementsByTagName('iframe')[j]['id']=="gsft_main" )
				var iframeDoc = document.getElementsByTagName('iframe')[j].contentWindow;
			
		}
		
		// Check the page is one you want to track
		CheckPageIsTimeTrackable( iframeDoc );
		
	}
	
}else{
	
	// Check the page is one you want to track
	CheckPageIsTimeTrackable( window );
	
}

// Function Check Page url
function CheckPageIsTimeTrackable( iframeDoc ){
	
	// Check for incident page
	if( iframeDoc.location.href.indexOf( "incident.do" ) != -1 ){
		
		// add button to page
		insertButton( iframeDoc, 'incident' );
		
	}
	
	// Check for Changes page
	if( iframeDoc.location.href.indexOf( "change_request.do" ) != -1 ){
		
		// add button to page
		insertButton( iframeDoc, 'change_request' );
		
	}
	
}

// Needed to be reimplemented to allow for alternate iframes
function insertButton( DocRoot, PageType ){
	
	// select elements
	var i, elems = DocRoot.document.querySelectorAll( ('div[id="element.'+PageType+'.time_worked"]:not(.toggl)') );
	
	// iterate through each element
    for (i = 0; i < elems.length; i++) {
		
		// Add the toggl class to each element
		elems[i].classList.add('toggl');
    }
	
	// repeat again after adding the class
    for (i = 0; i < elems.length; i++) {
		
		// render button
		renderButton( DocRoot, elems[i], PageType  );
    
	}
	
}

// Render each button
function renderButton( DocRoot, elem, PageType ){
	
	// Init Variables
	var link;
	var Tdescription, Tproject, Customer, Category, SubCategory, Priority;
	
	// begin pulling info from page
	Tdescription = DocRoot.document.getElementById( (PageType+'.short_description') ).value;
	Tproject = DocRoot.document.getElementById( (PageType+'.number') ).value;
	Customer = DocRoot.document.getElementById( ('sys_display.'+PageType+'.company') ).value;
	Priority = DocRoot.document.getElementById( (PageType+'.priority') ).value;
	
	// Check for change requests as thier category and subcategory
	if(PageType=='change_request'){
		
		// get the category and subcategory for changes
		Category = DocRoot.document.getElementById( 'change_request.category' ).value;
		SubCategory = DocRoot.document.getElementById( (PageType+'.u_subcategory') ).value;
		
	}else{
		
		// get the category and subcategory
		Category = DocRoot.document.getElementById( (PageType+'.category') ).value;
		SubCategory = DocRoot.document.getElementById( (PageType+'.subcategory') ).value;
		
	}
	
	// Get the element that this is going to be loaded into
	var TimeElement = DocRoot.document.getElementById( ('element.'+PageType+'.time_worked') );
	
	// Create button element
	link = togglbutton.createTimerLink({
		className: 'Service-Now',
		description: (""+Tdescription),
		projectName: (""+Tproject),
		tags: [ (""+Tproject), (""+Customer), (""+Category), (""+SubCategory), ("Priority-"+Priority) ]
    });
	
	// Embed element into iframe
	link.setAttribute("nowrap", "true");
	
	// Insert Timer next to service now's timer
	TimeElement.insertBefore( link, TimeElement.childNodes[TimeElement.childNodes.length-1] );
	
}
