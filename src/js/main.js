"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var smoothscroll_polyfill_1 = __importDefault(require("smoothscroll-polyfill"));
var Scroller_1 = __importDefault(require("./Scroller"));
smoothscroll_polyfill_1.default.polyfill();
window.onload = function () {
    var prev = document.querySelector(".prev");
    var next = document.querySelector(".next");
    new Scroller_1.default("#slider", {
        desktopClass: "hideScrollbar",
        prevPageHandler: prev,
        nextPageHandler: next,
    });
    var prev2 = document.querySelector(".prev2");
    var next2 = document.querySelector(".next2");
    new Scroller_1.default("#slider2", {
        prevPageHandler: prev2,
        nextPageHandler: next2,
    });
};
//# sourceMappingURL=main.js.map