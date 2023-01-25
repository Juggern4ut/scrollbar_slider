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
    initDefaultSlider();
    initMouseDragSlider();
    initMouseDragAlignSlider();
    initAutoplaySlider();
    initSnapSlider();
    initSnapSliderSoft();
};
var initDefaultSlider = function () {
    var _a, _b;
    var s = document.querySelector(".default-slider");
    var prev = (_a = s === null || s === void 0 ? void 0 : s.parentElement) === null || _a === void 0 ? void 0 : _a.querySelector(".prev");
    var next = (_b = s === null || s === void 0 ? void 0 : s.parentElement) === null || _b === void 0 ? void 0 : _b.querySelector(".next");
    new Scroller_1.default(s, {
        nextPageHandler: next,
        prevPageHandler: prev,
        desktopClass: "hideScrollbar",
    });
};
var initMouseDragSlider = function () {
    var _a, _b;
    var s = document.querySelector(".mouse-slider");
    var prev = (_a = s === null || s === void 0 ? void 0 : s.parentElement) === null || _a === void 0 ? void 0 : _a.querySelector(".prev");
    var next = (_b = s === null || s === void 0 ? void 0 : s.parentElement) === null || _b === void 0 ? void 0 : _b.querySelector(".next");
    new Scroller_1.default(s, {
        nextPageHandler: next,
        prevPageHandler: prev,
        mouseScrolling: true,
        desktopClass: "hideScrollbar",
    });
};
var initMouseDragAlignSlider = function () {
    var _a, _b;
    var s = document.querySelector(".mouse-slider-align");
    var prev = (_a = s === null || s === void 0 ? void 0 : s.parentElement) === null || _a === void 0 ? void 0 : _a.querySelector(".prev");
    var next = (_b = s === null || s === void 0 ? void 0 : s.parentElement) === null || _b === void 0 ? void 0 : _b.querySelector(".next");
    new Scroller_1.default(s, {
        nextPageHandler: next,
        prevPageHandler: prev,
        mouseScrolling: true,
        autoAlign: true,
        desktopClass: "hideScrollbar",
    });
};
var initAutoplaySlider = function () {
    var _a, _b;
    var s = document.querySelector(".autoplay-slider");
    var prev = (_a = s === null || s === void 0 ? void 0 : s.parentElement) === null || _a === void 0 ? void 0 : _a.querySelector(".prev");
    var next = (_b = s === null || s === void 0 ? void 0 : s.parentElement) === null || _b === void 0 ? void 0 : _b.querySelector(".next");
    new Scroller_1.default(s, {
        nextPageHandler: next,
        prevPageHandler: prev,
        mouseScrolling: true,
        autoplay: 2000,
        desktopClass: "hideScrollbar",
    });
};
var initSnapSlider = function () {
    var _a, _b;
    var s = document.querySelector(".snap-slider");
    var prev = (_a = s === null || s === void 0 ? void 0 : s.parentElement) === null || _a === void 0 ? void 0 : _a.querySelector(".prev");
    var next = (_b = s === null || s === void 0 ? void 0 : s.parentElement) === null || _b === void 0 ? void 0 : _b.querySelector(".next");
    new Scroller_1.default(s, {
        nextPageHandler: next,
        prevPageHandler: prev,
        mouseScrolling: true,
        dragSnapDistance: 100,
        dragSnapHard: true,
        desktopClass: "hideScrollbar",
    });
};
var initSnapSliderSoft = function () {
    var _a, _b;
    var s = document.querySelector(".snap-slider-soft");
    var prev = (_a = s === null || s === void 0 ? void 0 : s.parentElement) === null || _a === void 0 ? void 0 : _a.querySelector(".prev");
    var next = (_b = s === null || s === void 0 ? void 0 : s.parentElement) === null || _b === void 0 ? void 0 : _b.querySelector(".next");
    new Scroller_1.default(s, {
        nextPageHandler: next,
        prevPageHandler: prev,
        mouseScrolling: true,
        dragSnapDistance: 100,
        dragSnapHard: false,
        desktopClass: "hideScrollbar",
    });
};
//# sourceMappingURL=main.js.map