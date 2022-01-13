import smoothscroll from "smoothscroll-polyfill";
import Scroller from "./Scroller";

smoothscroll.polyfill();

window.onload = () => {
  const s1 = new Scroller("#slider");
  const s2 = new Scroller("#slider2");

  let prev = document.querySelector(".prev");
  let next = document.querySelector(".next");

  prev?.addEventListener("click", () => {
    s1.gotoLeft();
  });

  next?.addEventListener("click", () => {
    s1.gotoRight();
  });

  let prev2 = document.querySelector(".prev2");
  let next2 = document.querySelector(".next2");

  prev2?.addEventListener("click", () => {
    s2.gotoLeft();
  });

  next2?.addEventListener("click", () => {
    s2.gotoRight();
  });
};
