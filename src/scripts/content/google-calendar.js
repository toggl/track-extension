'use strict';

function insertButton(bubblecontent, description) {
  var link = togglbutton.createTimerLink({
    className: 'google-calendar',
    description: description
  });
  bubblecontent.insertBefore(link, bubblecontent.firstChild);
}

// Detail view
togglbutton.render('.ep:not(.toggl)', { observe: true }, function(elem) {
  var description, togglButtonElement;

  togglButtonElement = $('.ep-dpc', elem);
  description = $('.ep-title input', elem).value;

  insertButton(togglButtonElement, description);
});

// Popup view
togglbutton.render('.bubblecontent:not(.toggl)', { observe: true }, function(
  elem
) {
  // Goal view
  var description,
    goal = $('.title-text', elem),
    event = $('#mtb', elem);
  if (goal) {
    description = goal.textContent;
  }
  // Event view
  if (event) {
    description = event.textContent;
  }

  if (description) {
    insertButton(elem, description);
  }
});

// Popup view for Tasks
// we subscribe here for DOM changes, so we could get tasks IFrames with description info
var observer = new MutationObserver(function(mutations) {
  mutations.filter(function(mutation) {
    //tasks iframes are only one without id or class
    var iframe = Array.from(mutation.addedNodes.values()).find(function(node) {
      return (
        node instanceof HTMLIFrameElement &&
        node.id.length === 0 &&
        node.className.length === 0
      );
    });
    if (iframe) {
      iframe.onload = function() {
        var taskname = $('.b', this.contentDocument),
          bubblecontent = this.parentElement.parentElement.parentElement; //got to .bubblecontent so button styles be the same
        if (bubblecontent.classList.contains('bubblecontent')) {
          insertButton(bubblecontent, taskname.textContent);
        }
      };
    }
  });
});

observer.observe($('body'), { childList: true, subtree: true });

//Google Calendar Modern

function insertButtonModern(bubblecontent, description) {
  var link = togglbutton.createTimerLink({
    className: 'google-calendar-modern',
    description: description
  });
  bubblecontent.appendChild(link);
}

// Popup view Google Calendar Modern
togglbutton.render('div[data-chips-dialog="true"]', { observe: true }, function(
  elem
) {
  if ($('.toggl-button', elem)) {
    return;
  }
  var title = $('span[role="heading"]', elem),
    target = elem,
    description;
  if (title) {
    description = title.textContent;
    target = title.parentElement.previousSibling;
  }
  if (description) {
    insertButtonModern(target, description);
  }
});
