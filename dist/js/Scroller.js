"use strict";
var Scroller = /** @class */ (function () {
    function Scroller(selector) {
        this.container = document.querySelector(selector);
        this.items = this.container.children;
    }
    /**
     * Scroll to the previous page, if the current
     * position is at the end scroll to the first page
     */
    Scroller.prototype.gotoRight = function () {
        this.container.scroll(this.getNextPagePosition(), 0);
    };
    /**
     * Scroll to the previous page, if the current
     * position is 0 scroll to the last page
     */
    Scroller.prototype.gotoLeft = function () {
        this.container.scroll(this.getPrevPagePosition(), 0);
    };
    /**
     * Will calculate the scroll position of the next
     * page. If the slider is at the very end, will return
     * 0 so the slider can loop
     * @returns The scrollPosition of the next page
     */
    Scroller.prototype.getNextPagePosition = function () {
        var cont = this.container;
        if (cont.offsetWidth + cont.scrollLeft === cont.scrollWidth)
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
        if (cont.scrollLeft === 0)
            return cont.scrollWidth;
        var tmpPage = Math.floor((cont.scrollLeft - 1) / cont.offsetWidth);
        return tmpPage * cont.offsetWidth;
    };
    return Scroller;
}());
//# sourceMappingURL=Scroller.js.map