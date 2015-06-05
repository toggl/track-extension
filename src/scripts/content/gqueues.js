/*jslint indent: 2 */
/*global $: false, document: false, togglbutton: false*/
'use strict';

function insertBefore(newNode, referenceNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode);
}

function insertAfter(newNode, referenceNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

togglbutton.render('.gq-item-row:not(.toggl)', {observe: true}, function (elem) {
  console.log('Elem: ', elem);
  var link, container = createTag('a', 'taskItem-toggl'),
    titleElem = $('.gq-i-description', elem);

  if (titleElem) {
    console.log('title:', titleElem.innerText);
    link = togglbutton.createTimerLink({
      className: 'gqueues',
      buttonType: 'minimal',
      description: titleElem.innerText
      // projectName: projectTitleElem.innerText
    });
    console.log('link:', link)
    container.appendChild(link);
    insertAfter(container, titleElem);
  }

  


});

// // GQueues uses 1.5.2 jQuery
// window.onload = function() {
//   // retrieve ids of items
//   // var items = document.getElementById('gqItemList').getElementsByClassName('gq-item-row');
 
//   var items = $("#gqItemList").children;
//   console.log(items);
//   var ids = []
//   for (var i=0; i<items.length; i++) {
//     ids.push(items[i].id)
//   }
//   console.log(ids);

//   // add timer to each item
//   for (var i=0; i<ids.length; i++) {
//     if (ids[i] === "gqItemQueueEmpty") {
//       console.log('No items in gq')
//     }
//     else {
//       var wrapper = '#' + ids[i]; 
//       console.log(wrapper);
//       togglbutton.render(wrapper + ':not(.toggl)', {observe: true}, function (elem) {
//         console.log('About to add Link');

//         var link, description;
//         description = document.getElementById(elem.id).getElementsByClassName('gq-i-description')[0].innerHTML;
//         console.log(description);

//         link = togglbutton.createTimerLink({
//           className: 'gqueues',
//           description: 'gqueues-' + description,
//           projectName: 'gqueues-' + description
//         });

//         elem.appendChild(link);
//       });
//     }
//   }
// }