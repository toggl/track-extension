'use strict';

togglbutton.render('#left-panel:not(.toggl)', {}, function() {
  var link,
    wrap = createTag('div'),
    prevElem = $('#left-panel .ui-grid-a'),
    cloudesDescription = function() {
      return $('title').textContent;
    };

  link = togglbutton.createTimerLink({
    className: 'cloudes',
    description: cloudesDescription
  });

  wrap.appendChild(link);
  wrap.className = 'boxedDotted';
  prevElem.parentNode.insertBefore(wrap, prevElem.nextSibling);
});
