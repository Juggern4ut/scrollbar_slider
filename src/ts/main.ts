window.onload = () => {
  window["t"] = new Scroller("#slider");
  window["u"] = new Scroller("#slider2");

  let prev = document.querySelector(".prev");
  let next = document.querySelector(".next");

  prev?.addEventListener("click", () => {
    window["t"].gotoLeft();
  });

  next?.addEventListener("click", () => {
    window["t"].gotoRight();
  });

  let prev2 = document.querySelector(".prev2");
  let next2 = document.querySelector(".next2");

  prev2?.addEventListener("click", () => {
    window["u"].gotoLeft();
  });

  next2?.addEventListener("click", () => {
    window["u"].gotoRight();
  });
};
