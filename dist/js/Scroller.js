"use strict";
var Scroller = /** @class */ (function () {
    function Scroller(selector) {
        this.container = document.querySelector(selector);
        this.items = this.container.children;
    }
    /**
     * Will calculate the width of a given Element
     * including horizontal margins
     * @param slide The slide to calculate the width of
     * @returns The width of the slide including margins
     */
    Scroller.prototype.getTotalWidth = function (slide) {
        var styles = window.getComputedStyle(slide);
        return (parseInt(styles.marginRight) +
            parseInt(styles.marginLeft) +
            parseInt(styles.width));
    };
    /**
     * Scroll to the next page
     */
    Scroller.prototype.gotoRight = function () {
        this.goto(false);
    };
    /**
     * Scroll to the previous page
     */
    Scroller.prototype.gotoLeft = function () {
        this.goto(true);
    };
    /**
     * Will scroll the slider either right or left
     * to the next page, depending on the given parameter
     * @param left If set to true, the slider will scroll left, and right otherwise
     */
    Scroller.prototype.goto = function (left) {
        if (left === void 0) { left = false; }
        var firstSlide = this.items[0];
        var slideWidth = this.getTotalWidth(firstSlide);
        var pageWidth = this.getElementsPerPage() * slideWidth;
        var targetPage = left
            ? Math.floor((this.container.scrollLeft - 1) / pageWidth)
            : Math.ceil((this.container.scrollLeft + 1) / pageWidth);
        this.container.scroll(targetPage * pageWidth, 0);
    };
    /**
     * Will return the number of Elements that can
     * be simoutaniusly displayed per Page
     * @returns The number of elements per Page
     */
    Scroller.prototype.getElementsPerPage = function () {
        var slide = this.items[0];
        var slideWidth = this.getTotalWidth(slide);
        var containerWidth = parseInt(window.getComputedStyle(this.container).width);
        return Math.round(containerWidth / slideWidth);
    };
    return Scroller;
}());
//# sourceMappingURL=Scroller.js.map