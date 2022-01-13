"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var smoothscroll_polyfill_1 = __importDefault(require("smoothscroll-polyfill"));
var Scroller_1 = __importDefault(require("./Scroller"));
smoothscroll_polyfill_1.default.polyfill();
window.onload = function () {
    var s1 = new Scroller_1.default("#slider");
    var s2 = new Scroller_1.default("#slider2");
    var prev = document.querySelector(".prev");
    var next = document.querySelector(".next");
    prev === null || prev === void 0 ? void 0 : prev.addEventListener("click", function () {
        s1.gotoLeft();
    });
    next === null || next === void 0 ? void 0 : next.addEventListener("click", function () {
        s1.gotoRight();
    });
    var prev2 = document.querySelector(".prev2");
    var next2 = document.querySelector(".next2");
    prev2 === null || prev2 === void 0 ? void 0 : prev2.addEventListener("click", function () {
        s2.gotoLeft();
    });
    next2 === null || next2 === void 0 ? void 0 : next2.addEventListener("click", function () {
        s2.gotoRight();
    });
};
//# sourceMappingURL=main.js.map