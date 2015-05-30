/*jslint indent: 2 */
/*global $: false, document: false, togglbutton: false*/
'use strict';

var list = $("#gqItemList").children;
console.log(list.length);
var ids = []
for (var i=0; i<list.length; i++) {
  ids.push(list[i].id)
}

for (i=0; i<ids.length; i++) {
  if (ids[i] === "gqItemQueueEmpty") {
    console.log('No items in gq')
  }
  else {
    var wrapper = '#' + ids[i]; 
    console.log(wrapper);
    togglbutton.render(wrapper + ':not(.toggl)', {observe: true}, function (elem) {
      console.log('About to add Link');



      var link,
        description = $(wrapper + ' .gq-i-description', elem).text;
      console.log(description);

      link = togglbutton.createTimerLink({
        className: 'gqueues',
        description: description,
        projectName: 'gqueues-'
      });

      elem.appendChild(link);
    });
  }
}
