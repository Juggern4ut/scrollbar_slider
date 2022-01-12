"use strict";
window.onload = function () {
    window["t"] = new Scroller("#slider", 4, [
        { width: 760, slides: 3 },
        { width: 480, slides: 2 },
        { width: 320, slides: 1 },
    ]);
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