import smoothscroll from "smoothscroll-polyfill";
import Prism from "prismjs";
import Scroller from "./Scroller";

interface NamespaceWindow extends Window {
  scrollers: Scroller[];
  pgSlider: Scroller;
}
declare var window: NamespaceWindow;

smoothscroll.polyfill();

window.onload = () => {
  Prism.highlightAll();
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
          mouseScrolling: true,
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
          mouseDragCallback: (o: any) => console.log(o),
          autoAlign: true,
          noScrollClass: "cantScrollMate",
        })
      );
    }
  });

  const playgroundSlider = document.querySelector(".slider2") as HTMLElement;

  const prev = playgroundSlider.parentElement?.querySelector(
    ".prev"
  ) as HTMLElement;
  const next = playgroundSlider.parentElement?.querySelector(
    ".next"
  ) as HTMLElement;

  const pgSlider = new Scroller(playgroundSlider, {
    desktopClass: "hideScrollbar",
    mouseScrolling: true,
    prevPageHandler: prev,
    nextPageHandler: next,
    autoAlign: true,
    noScrollClass: "no-scroll",
    dragSnapDistance: 50,
    dragSnapHard: true,
  });
};
