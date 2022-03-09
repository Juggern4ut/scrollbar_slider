"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var smoothscroll_polyfill_1 = __importDefault(require("smoothscroll-polyfill"));
var prismjs_1 = __importDefault(require("prismjs"));
var Scroller_1 = __importDefault(require("./Scroller"));
smoothscroll_polyfill_1.default.polyfill();
window.onload = function () {
    prismjs_1.default.highlightAll();
    var sliders = document.querySelectorAll(".slider");
    window.scrollers = [];
    sliders.forEach(function (s) {
        var _a, _b;
        var slider = s;
        var prev = (_a = slider.parentElement) === null || _a === void 0 ? void 0 : _a.querySelector(".prev");
        var next = (_b = slider.parentElement) === null || _b === void 0 ? void 0 : _b.querySelector(".next");
        if (slider.classList.contains("slider--autoplay")) {
            window.scrollers.push(new Scroller_1.default(slider, {
                desktopClass: "hideScrollbar",
                prevPageHandler: prev,
                nextPageHandler: next,
                mouseScrolling: true,
                autoplay: 0,
            }));
        }
        else {
            window.scrollers.push(new Scroller_1.default(slider, {
                desktopClass: "hideScrollbar",
                prevPageHandler: prev,
                nextPageHandler: next,
                mouseScrolling: true,
                autoAlign: true,
            }));
        }
    });
};
//# sourceMappingURL=main.js.map