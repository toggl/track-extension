/*jslint indent: 4 */
/*global window: false, document: false, chrome: false, $: false, createTag: false, createLink: false*, createProjectSelect: false*/
"use strict";

/**
 * Toggl button for Podio
 * Created by Empirio AS - www.empir.io
 *
 * @name toggl-button-podio
 * @author Flamur Mavraj <flamur.mavraj@empir.io>
 * @version 1.1
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

    function createTogglBtn(title){
        var link;

        link = createLink('toggl-button');
        link.addEventListener("click", function _listener(e) {
            var msg, btnText, notice, startedCls = 'color-green';

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
                btnText = 'Stop timer';
                notice = 'Toggl timer started succesfully.';
                link.classList.add(startedCls);
            }

            chrome.extension.sendMessage(msg);
            notification(notice, 'notice');
            link.innerHTML = btnText;
            isStarted = !isStarted;
        });

        return link
    }

    function addButtonListener(e){
        var element, title, container, link, project;
        var item, task;
        var togglbtn, togglbtnwrapper;

        item = $('.item-preview, #item_view_page');
        task = $('#task-permalink, #js-task-list');

        element = $('.item-preview, #item_view_page, #task-permalink');

        if(item || task){
            if(item){

                container = $(".action-bar ul", item);

                if(container === null) return;

                // If the button is inserted once return false
                if ($('.toggl-button-wrapper', container)) return false;

                // Get the title of the item
                title = $('.title-link .title', item).innerHTML;

                togglbtn = createTogglBtn(title);
                togglbtnwrapper = document.createElement('li');
                togglbtnwrapper.className = 'float-left toggl-button-wrapper';

                container.appendChild(togglbtnwrapper);
                togglbtnwrapper.appendChild(togglbtn);

            }else if(task){
                var singleTaskPage, multiTaskPage;

                singleTaskPage  = $(".action-bar ul", task);
                multiTaskPage   = $(".task-detail", task);

                if(singleTaskPage && singleTaskPage !== null){

                    // If the button is inserted once return false
                    if ($('.toggl-button-wrapper', singleTaskPage)) return false;

                    title = $('.header-title', task).innerHTML;

                    togglbtn        = createTogglBtn(title);
                    togglbtnwrapper = document.createElement('li');
                    togglbtnwrapper.className = 'float-left toggl-button-wrapper';

                    singleTaskPage.appendChild(togglbtnwrapper);
                    togglbtnwrapper.appendChild(togglbtn);

                }else if(multiTaskPage && multiTaskPage !== null){

                    // If the button is inserted once return false
                    if ($('.toggl-button-wrapper-task', multiTaskPage)) return false;

                    title    = $('.task-link', multiTaskPage.parentNode).innerHTML;


                    container = $('.edit-task-reference-wrapper', multiTaskPage);

                    togglbtn        = createTogglBtn(title);
                    togglbtnwrapper = document.createElement('div');
                    togglbtnwrapper.className = 'task-via toggl-button-wrapper-task';
                    togglbtnwrapper.appendChild(togglbtn);

                    container.parentNode.insertBefore(togglbtnwrapper, container.nextSibling);

                }else{
                    return;
                }
            }

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
