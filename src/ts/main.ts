import smoothscroll from "smoothscroll-polyfill";
import Scroller from "./Scroller";

smoothscroll.polyfill();

window.onload = () => {
  const prev = document.querySelector(".prev") as HTMLElement;
  const next = document.querySelector(".next") as HTMLElement;
  new Scroller("#slider", {
    desktopClass: "hideScrollbar",
    prevPageHandler: prev,
    nextPageHandler: next,
  });

  const prev2 = document.querySelector(".prev2") as HTMLElement;
  const next2 = document.querySelector(".next2") as HTMLElement;
  new Scroller("#slider2", {
    prevPageHandler: prev2,
    nextPageHandler: next2,
  });
};
