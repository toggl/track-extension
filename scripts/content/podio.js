/*jslint indent: 4 */
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
    var isStarted = false;

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
                var msg, btnText, notice,
                    startedCls = 'color-green';

                if(isStarted) {
                    msg = {type: 'stop'};
                    btnText = 'Start timer';
                    notice = 'Toggl timer stopped.';
                    link.classList.remove(startedCls);
                } else {
                    msg = {
                        type: 'timeEntry',
                        description: title
                    };
                    btnText = 'Started...';
                    notice = 'Toggl timer started succesfully.';
                    link.classList.add(startedCls);
                }
                chrome.extension.sendMessage(msg);
                notification(notice, 'notice');
                link.innerHTML = btnText;
                isStarted = !isStarted;
            });

            var li = document.createElement('li');
            li.className = 'float-left toggl-button-wrapper';

            container.appendChild(li);
            li.appendChild(link);

            // new button created - reset state
            isStarted = false;
        }
    }


    chrome.extension.sendMessage({type: 'activate'}, function (response) {
        if (response.success) {
            document.addEventListener('DOMNodeInserted', addButtonListener);
        }
    });

}());
