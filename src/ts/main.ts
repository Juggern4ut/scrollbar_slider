window.onload = () => {
  window["t"] = new Scroller("#slider", 4, [
    { width: 760, slides: 3 },
    { width: 480, slides: 2 },
    { width: 320, slides: 1 },
  ]);

  let prev = document.querySelector(".prev");
  let next = document.querySelector(".next");

  prev?.addEventListener("click", () => {
    window["t"].gotoLeft();
  });

  next?.addEventListener("click", () => {
    window["t"].gotoRight();
  });
};
