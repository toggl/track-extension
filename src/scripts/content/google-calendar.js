/*jslint indent: 2 */
/*global $: false, document: false, togglbutton: false*/
'use strict';

function insertButton(bubblecontent, description)
{
  var link = togglbutton.createTimerLink({
    className: 'google-calendar',
    description: description
  });
  bubblecontent.insertBefore(link, bubblecontent.firstChild);
}

// Detail view
togglbutton.render('.ep:not(.toggl)', {observe: true}, function (elem) {
  var link, description, togglButtonElement;

  togglButtonElement = $('.ep-dpc', elem);
  description = $('.ep-title input', elem).value;

  insertButton(togglButtonElement, description);
});

// Popup view
togglbutton.render('.bubblecontent:not(.toggl)', {observe: true}, function (elem) {    
  var description;
  // Goal view  
  var goal = $('.title-text', elem);
  if (goal) description = goal.textContent;
  // Event view
  var event = $('#mtb', elem);
  if (event) description = event.textContent;

  if(description)
    insertButton(elem, description);    
});

// Popup view for Tasks
// we subscribe here for DOM changes, so we could get tasks IFrames with description info
var observer = new MutationObserver(function(mutations) {
  mutations.filter(function(mutation) {
    //tasks iframes are only one without id or class
    var iframeselector = function (node) {                
      return node instanceof HTMLIFrameElement && node.id.length == 0 && node.className.length == 0; 
    }
    var iframe = [...mutation.addedNodes.values()].find(iframeselector);
    if( iframe )
    {
      iframe.onload = function(){     
        var taskname = $('.b', this.contentDocument);

        //got to .bubblecontent so button styles be the same
        var bubblecontent = this.parentElement.parentElement.parentElement; 
        if(bubblecontent.classList.contains("bubblecontent"))
          insertButton(bubblecontent, taskname.textContent);            
      };
    }
  });    
});

observer.observe($('body'), { childList: true, subtree: true });