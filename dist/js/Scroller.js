"use strict";
var Scroller = /** @class */ (function () {
    function Scroller(selector) {
        this.container = document.querySelector(selector);
        this.items = this.container.children;
    }
    Scroller.prototype.getTotalWidth = function (slide) {
        var styles = window.getComputedStyle(slide);
        return (parseInt(styles.marginRight) +
            parseInt(styles.marginLeft) +
            parseInt(styles.width));
    };
    Scroller.prototype.gotoRight = function () {
        var firstSlide = this.items[0];
        var slideWidth = this.getTotalWidth(firstSlide);
        var pageWidth = this.getSlideAmount() * slideWidth;
        var targetPage = Math.ceil((this.container.scrollLeft + 1) / pageWidth);
        this.container.scroll(targetPage * pageWidth, 0);
    };
    Scroller.prototype.gotoLeft = function () {
        var firstSlide = this.items[0];
        var slideWidth = this.getTotalWidth(firstSlide);
        var pageWidth = this.getSlideAmount() * slideWidth;
        var targetPage = Math.floor((this.container.scrollLeft - 1) / pageWidth);
        this.container.scroll(targetPage * pageWidth, 0);
    };
    Scroller.prototype.getSlideAmount = function () {
        var slide = this.items[0];
        var slideWidth = this.getTotalWidth(slide);
        var containerWidth = parseInt(window.getComputedStyle(this.container).width);
        return Math.round(containerWidth / slideWidth);
    };
    return Scroller;
}());
//# sourceMappingURL=Scroller.js.map