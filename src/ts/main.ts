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

  initDefaultSlider();
  initMouseDragSlider();
  initMouseDragSlider();
  initMouseDragSlider();
  initMouseDragAlignSlider();
  initAutoplaySlider();
  initSnapSlider();
  initSnapSliderSoft();
};

const initDefaultSlider = () => {
  const s = document.querySelector(".default-slider") as HTMLElement;
  const prev = s?.parentElement?.querySelector(".prev") as HTMLElement;
  const next = s?.parentElement?.querySelector(".next") as HTMLElement;
  new Scroller(s, {
    nextPageHandler: next,
    prevPageHandler: prev,
    desktopClass: "hideScrollbar",
  });
};

const initMouseDragSlider = () => {
  const s = document.querySelector(".mouse-slider") as HTMLElement;
  const prev = s?.parentElement?.querySelector(".prev") as HTMLElement;
  const next = s?.parentElement?.querySelector(".next") as HTMLElement;
  new Scroller(s, {
    nextPageHandler: next,
    prevPageHandler: prev,
    mouseScrolling: true,
    desktopClass: "hideScrollbar",
  });
};

const initMouseDragAlignSlider = () => {
  const s = document.querySelector(".mouse-slider-align") as HTMLElement;
  const prev = s?.parentElement?.querySelector(".prev") as HTMLElement;
  const next = s?.parentElement?.querySelector(".next") as HTMLElement;
  new Scroller(s, {
    nextPageHandler: next,
    prevPageHandler: prev,
    mouseScrolling: true,
    autoAlign: true,
    desktopClass: "hideScrollbar",
  });
};

const initAutoplaySlider = () => {
  const s = document.querySelector(".autoplay-slider") as HTMLElement;
  const prev = s?.parentElement?.querySelector(".prev") as HTMLElement;
  const next = s?.parentElement?.querySelector(".next") as HTMLElement;
  new Scroller(s, {
    nextPageHandler: next,
    prevPageHandler: prev,
    mouseScrolling: true,
    autoplay: 2000,
    desktopClass: "hideScrollbar",
  });
};

const initSnapSlider = () => {
  const s = document.querySelector(".snap-slider") as HTMLElement;
  const prev = s?.parentElement?.querySelector(".prev") as HTMLElement;
  const next = s?.parentElement?.querySelector(".next") as HTMLElement;
  new Scroller(s, {
    nextPageHandler: next,
    prevPageHandler: prev,
    mouseScrolling: true,
    dragSnapDistance: 100,
    dragSnapHard: true,
    desktopClass: "hideScrollbar",
  });
};

const initSnapSliderSoft = () => {
  const s = document.querySelector(".snap-slider-soft") as HTMLElement;
  const prev = s?.parentElement?.querySelector(".prev") as HTMLElement;
  const next = s?.parentElement?.querySelector(".next") as HTMLElement;
  new Scroller(s, {
    nextPageHandler: next,
    prevPageHandler: prev,
    mouseScrolling: true,
    dragSnapDistance: 100,
    dragSnapHard: false,
    desktopClass: "hideScrollbar",
  });
};
