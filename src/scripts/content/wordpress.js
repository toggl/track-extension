/*jslint indent: 2 */
/*global $: false, document: false, togglbutton: false*/
'use strict';

togglbutton.render('#submitdiv:not(.toggl)', {observe: true}, function () {

  var getDescription = function () {

    var desc = document.title;

    var pageTitle = document.getElementsByTagName( "h1" )[0]; // The page title (New post, Edit post, etc...)
    var postTitle = document.getElementById( 'title' ); // The post title (maybe isn't set)

    if( pageTitle )
    {
      desc = pageTitle.innerHTML.replace( /<a\b[^>]*>(.*?)<\/a>/i, '' ); // Remove button texts from page title

      if( postTitle && postTitle.value )
      {
        desc += " - " + postTitle.value; // Possible double space
      }

    }

    return desc.replace(/ +(?= )/g, ''); //Remove double whitespace and return
  },

  link = togglbutton.createTimerLink({
    className: 'wordpress',
    description: getDescription
  }),

  targetWrap = $('#poststuff #post-body-content');

  if (targetWrap) {

    link.style.position = "absolute";
    link.style.top = "-40px";
    link.style.right = "0";

    targetWrap.style.position = 'relative';

    targetWrap.insertBefore( link, targetWrap.firstChild );

  }

});