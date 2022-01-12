"use strict";
window.onload = function () {
    window["t"] = new Scroller("#slider");
    window["u"] = new Scroller("#slider2");
    var prev = document.querySelector(".prev");
    var next = document.querySelector(".next");
    prev === null || prev === void 0 ? void 0 : prev.addEventListener("click", function () {
        window["t"].gotoLeft();
    });
    next === null || next === void 0 ? void 0 : next.addEventListener("click", function () {
        window["t"].gotoRight();
    });
    var prev2 = document.querySelector(".prev2");
    var next2 = document.querySelector(".next2");
    prev2 === null || prev2 === void 0 ? void 0 : prev2.addEventListener("click", function () {
        window["u"].gotoLeft();
    });
    next2 === null || next2 === void 0 ? void 0 : next2.addEventListener("click", function () {
        window["u"].gotoRight();
    });
};
//# sourceMappingURL=main.js.map