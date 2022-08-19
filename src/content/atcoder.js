/**
 * @name AtCoder
 * @urlAlias atcoder.jp
 * @urlRegex *://*.atcoder.jp/*
 */
"use strict";

togglbutton.render(
  ".contest-duration:not(.toggl)",
  { observe: true },
  function (elem) {
    const getDescription = () => {
      const contestTitle = document.querySelector(".contest-title").innerText;
      // .contest-title is in only contest page

      const problemTitle = document.title;
      if (problemTitle.includes(contestTitle)) {
        // in contest top page, problemTitle includes contest title. so not need it.
        return contestTitle;
      }
      return `${problemTitle} - ${contestTitle}`;
    };

    const link = togglbutton.createTimerLink({
      description: getDescription(),
    });

    elem.appendChild(link);
  }
);
