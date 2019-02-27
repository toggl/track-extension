'use strict';

togglbutton.render('#left-panel:not(.toggl)', {}, function () {
  const wrap = createTag('div');
  const prevElem = $('#left-panel .ui-grid-a');
  const cloudesDescription = function () {
    return $('title').textContent;
  };

  const link = togglbutton.createTimerLink({
    className: 'cloudes',
    description: cloudesDescription
  });

  wrap.appendChild(link);
  wrap.className = 'boxedDotted';
  prevElem.parentNode.insertBefore(wrap, prevElem.nextSibling);
});
