window.onload = () => {
  window["t"] = new Scroller("#slider");

  let prev = document.querySelector(".prev");
  let next = document.querySelector(".next");

  prev?.addEventListener("click", () => {
    window["t"].gotoLeft();
  });

  next?.addEventListener("click", () => {
    window["t"].gotoRight();
  });
};
