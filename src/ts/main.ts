import smoothscroll from "smoothscroll-polyfill";
import Scroller from "./Scroller";

interface NamespaceWindow extends Window {
  scrollers: Scroller[];
}
declare var window: NamespaceWindow;

smoothscroll.polyfill();

window.onload = () => {
  const sliders = document.querySelectorAll(".slider");
  window.scrollers = [];

  sliders.forEach((s) => {
    const slider = s as HTMLElement;
    const prev = slider.parentElement?.querySelector(".prev") as HTMLElement;
    const next = slider.parentElement?.querySelector(".next") as HTMLElement;

    if (slider.classList.contains("slider--autoplay")) {
      window.scrollers.push(
        new Scroller(slider, {
          desktopClass: "hideScrollbar",
          prevPageHandler: prev,
          nextPageHandler: next,
          autoplay: 2000,
        })
      );
    } else {
      window.scrollers.push(
        new Scroller(slider, {
          desktopClass: "hideScrollbar",
          prevPageHandler: prev,
          nextPageHandler: next,
          mouseScrolling: true,
        })
      );
    }
  });
};
