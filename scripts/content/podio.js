/*jslint indent: 2 */
/*global window: false, document: false, chrome: false, $: false, createTag: false, createLink: false*, createProjectSelect: false*/
"use strict";

/**
 * Toggl button for Podio
 * Created by Empirio AS - www.empir.io
 *
 * @name toggl-button-podio
 * @author Flamur Mavraj <flamur.mavraj@empir.io>
 * @version 1.0
 */
(function () {

    function notification(message, type){
        var container, notification;

        container = document.createElement('ul');
        container.className = 'push-notifications-wrapper';

        notification = document.createElement('li');
        notification.className = 'toggl-button-notification notification flashmessage ' + type;
        notification.innerHTML = '<div class="inner"><div class="image-block message"><div class="img icon"><div class="icon-16 icon-16-single-green-tick"></div>' +
                                 '</div><div class="bd text"><h4 class="text-bold">' + message +'</h4></div></div></div>';

        document.body.appendChild(container);
        container.appendChild(notification);

        window.setTimeout(function () {
            container.removeChild($('.toggl-button-notification'));
        }, 2500);
    }

    function addButtonListener(e){
        var element, title, container, link, project;

        element = $('.item-preview, #item_view_page');

        if(element){
            container = $(".action-bar ul", element);

            if(container === null) return;

            // If the button is inserted once return false
            if ($('.toggl-button-wrapper', container)) return false;

            // Get the title of the item
            title = $('.title-link .title', element).innerHTML;

            link = createLink('toggl-button');
            link.addEventListener("click", function _listener(e) {
                chrome.extension.sendMessage({
                    type: 'timeEntry',
                    description: title
                });

                // Add notification and inform the user that the timer has started
                notification('Toggl timer started succesfully.', 'notice');

                // Change the timer text to "Started!"
                link.innerHTML = "Started!";

                // Add green color and remove the hand cursor
                link.className = 'toggl-button color-green disable';

                // Disable the click event listener  since we already have started the timer
                link.removeEventListener('click', _listener);

            });

            var li = document.createElement('li');
            li.className = 'float-left toggl-button-wrapper';

            container.appendChild(li);
            li.appendChild(link)

        }
    }


    chrome.extension.sendMessage({type: 'activate'}, function (response) {
        if (response.success) {
            document.addEventListener('DOMNodeInserted', addButtonListener);
        }
    });

}());
