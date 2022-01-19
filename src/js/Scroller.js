"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Scroller = /** @class */ (function () {
    /**
     * Will create a new horizontal slider on the given selector using
     * the options passed to the constructor
     * @param selector The selector to find the container of the slider
     * @param options The options used to build the slider (optional)
     */
    function Scroller(selector, options) {
        var _this = this;
        if (typeof selector === "string") {
            this.container = document.querySelector(selector);
        }
        else {
            this.container = selector;
        }
        if ((options === null || options === void 0 ? void 0 : options.desktopClass) && window.ontouchstart === undefined) {
            this.container.classList.add(options.desktopClass);
        }
        if (options === null || options === void 0 ? void 0 : options.nextPageHandler) {
            options.nextPageHandler.addEventListener("click", function () { return _this.gotoRight(); });
        }
        if (options === null || options === void 0 ? void 0 : options.prevPageHandler) {
            options.prevPageHandler.addEventListener("click", function () { return _this.gotoLeft(); });
        }
    }
    /**
     * Scroll to the previous page, if the current
     * position is at the end scroll to the first page
     */
    Scroller.prototype.gotoRight = function () {
        this.container.scroll({
            top: 0,
            left: this.getNextPagePosition(),
            behavior: "smooth",
        });
    };
    /**
     * Scroll to the previous page, if the current
     * position is 0 scroll to the last page
     */
    Scroller.prototype.gotoLeft = function () {
        this.container.scroll({
            top: 0,
            left: this.getPrevPagePosition(),
            behavior: "smooth",
        });
    };
    /**
     * Will calculate the scroll position of the next
     * page. If the slider is at the very end, will return
     * 0 so the slider can loop
     * @returns The scrollPosition of the next page
     */
    Scroller.prototype.getNextPagePosition = function () {
        var cont = this.container;
        if (cont.offsetWidth + cont.scrollLeft > cont.scrollWidth - 25)
            return 0;
        var tmpPage = Math.ceil((cont.scrollLeft + 1) / cont.offsetWidth);
        return tmpPage * cont.offsetWidth;
    };
    /**
     * Will calculate the scroll position of the previous
     * page. If the slider is at the very beginning, will return
     * the positon of the last page so the slider can loop
     */
    Scroller.prototype.getPrevPagePosition = function () {
        var cont = this.container;
        if (cont.scrollLeft < 25)
            return cont.scrollWidth;
        var tmpPage = Math.floor((cont.scrollLeft - 1) / cont.offsetWidth);
        return tmpPage * cont.offsetWidth;
    };
    return Scroller;
}());
exports.default = Scroller;
//# sourceMappingURL=Scroller.js.map