/*jslint indent: 2 */
/*global $: false, document: false, togglbutton: false, createTag: false*/
/*Created by hamdikavak on 2/13/16.*/

'use strict';

togglbutton.render('#left-panel:not(.toggl)', {}, function () {
  var link, wrap = createTag('div'),
    prevElem = $('#left-panel .ui-grid-a'),
    cloudesDescription = function () {
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
