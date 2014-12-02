/*jslint indent: 2 */
/*global $: false, document: false, togglbutton: false, createTag:false*/

'use strict';

console.log("Load Toggl for Teamwork");

togglbutton.render('div.taskRHS:not(.toggl)', {observe: true}, function (elem) {
  var link, className = 'huh', container = $('.taskUsedOps', elem), spanTag;

  if (container === null) {
    return;
  }

  if( $('.taskName', elem) === null ) {
    return;
  }
  var desc = $('.taskName', elem).textContent;

  link = togglbutton.createTimerLink({
    className: 'teamworkpm',
    description: desc,
    projectName: $("#projectName").innerHTML
  });

  link.classList.add( className );
    
  link.addEventListener('click', function (e) {

    // Run through and hide all others
    var i, len, elems = document.querySelectorAll(".toggl-button");
    for (i = 0, len = elems.length; i < len; i += 1) {
      elems[i].classList.add('huh');
    }

    if (link.classList.contains( className ) ) {
      link.classList.remove( className );
    } else {
      link.classList.add( className );
    }
  });

  spanTag = document.createElement("span");
  link.style.width = 'auto';
  spanTag.appendChild(link);  
  container.insertBefore( spanTag, container.firstChild);
});
