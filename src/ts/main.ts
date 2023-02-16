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
  initNoScrollSlider();
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

const initNoScrollSlider = () => {
  const s = document.querySelector(".no-scroll-slider") as HTMLElement;
  const prev = s?.parentElement?.querySelector(".prev") as HTMLElement;
  const next = s?.parentElement?.querySelector(".next") as HTMLElement;

  const add = document.querySelector("#add-slide") as HTMLButtonElement;
  const remove = document.querySelector("#remove-slide") as HTMLButtonElement;
  
  const noScrollSlider = new Scroller(s, {
    nextPageHandler: next,
    prevPageHandler: prev,
    mouseScrolling: true,
    desktopClass: "hideScrollbar",
    noScrollClass: "red-border",
  });

  add.addEventListener("click", (e) => {
    const newNode = document.createElement("div");
    const newLink = document.createElement("a");
    newNode.classList.add("slide");
    newLink.innerHTML = noScrollSlider.container.children.length.toString();
    newNode.appendChild(newLink);
    noScrollSlider.container.appendChild(newNode);
  });

  remove.addEventListener("click", (e) => {
    if (noScrollSlider.container.children.length <= 1) return;
    noScrollSlider.container.children[
      noScrollSlider.container.children.length - 1
    ].remove();
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
