'use strict';

// Main function to add a Toggle Track button to the email view
// of FastMail. Does not (yet...) integrate with Calendar or Contacts.
togglbutton.render(
  // Add the button to the conversation view toolbar
  '#conversation .v-Toolbar .v-Toolbar-flex:not(.toggl)',
  { observe: true },
  function (elem) {
    // Create timer link element
    const link = togglbutton.createTimerLink({
      description: function () {
        // Use the subject as the description if we have one.
        let subject = document.querySelector('#conversation .v-Thread-title');
        if (subject.textContent) {
          return subject.textContent;
        } else {
          return '';
        }
      },
    });
    
    // Add fastmail styles to make the button look neatly integrated - copy
    // them from the Archive button so we match the users theme.
	  link.classList.add(
      ...document.querySelector('#conversation .s-archive').classList
    );
    // Swap the archive class with a toggl one
    link.classList.replace('s-archive', 's-toggl');
    
    // A tiny little tweak to better vertically align the icon and text.
    // Only do this if it's not already set to avoid breaking
    // something in future.
    if (!link.style.paddingTop) {
      link.style.paddingTop = '2px';
    }
    
    // Add link to element
    elem.before(link);
    
    // Add a toolbar divider before the button
    let toolbarDivider = document.createElement('span');
    toolbarDivider.className = 'v-Toolbar-divider';
    link.before(toolbarDivider);
  }
);
