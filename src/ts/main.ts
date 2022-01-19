import smoothscroll from "smoothscroll-polyfill";
import Scroller from "./Scroller";

smoothscroll.polyfill();

window.onload = () => {
  const sliders = document.querySelectorAll(".slider");

  sliders.forEach((s) => {
    const slider = s as HTMLElement;
    const prev = slider.parentElement?.querySelector(".prev") as HTMLElement;
    const next = slider.parentElement?.querySelector(".next") as HTMLElement;

    new Scroller(slider, {
      desktopClass: "hideScrollbar",
      prevPageHandler: prev,
      nextPageHandler: next,
    });
  });
};
