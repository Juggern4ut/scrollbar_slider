"use strict";
window.onload = function () {
    window["t"] = new Scroller("#slider");
    var prev = document.querySelector(".prev");
    var next = document.querySelector(".next");
    prev === null || prev === void 0 ? void 0 : prev.addEventListener("click", function () {
        window["t"].gotoLeft();
    });
    next === null || next === void 0 ? void 0 : next.addEventListener("click", function () {
        window["t"].gotoRight();
    });
};
//# sourceMappingURL=main.js.map