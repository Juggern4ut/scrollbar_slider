"use strict";
var Scroller = /** @class */ (function () {
    function Scroller(selector, defaultSlides, responsive) {
        this.container = document.querySelector(selector);
        this.items = this.container.children;
        this.responsive = responsive;
        this.defaultSlideAmount = defaultSlides;
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
        var pageWidth = this.getSlideAmountFromResponsive() * slideWidth;
        var targetPage = Math.ceil((this.container.scrollLeft + 1) / pageWidth);
        this.container.scroll(targetPage * pageWidth, 0);
    };
    Scroller.prototype.gotoLeft = function () {
        var firstSlide = this.items[0];
        var slideWidth = this.getTotalWidth(firstSlide);
        var pageWidth = this.getSlideAmountFromResponsive() * slideWidth;
        var targetPage = Math.floor((this.container.scrollLeft - 1) / pageWidth);
        this.container.scroll(targetPage * pageWidth, 0);
    };
    /**
     * Will return the amount of slides currently
     * displayed in the slider per page based on
     * the responsive settings
     * @returns The number of slides per Page
     */
    Scroller.prototype.getSlideAmountFromResponsive = function () {
        var windowWidth = window.innerWidth;
        var minWW = Number.MAX_VALUE;
        var minSlideAmount = this.defaultSlideAmount;
        this.responsive.forEach(function (entry) {
            if (entry.width < minWW && entry.width >= windowWidth) {
                minWW = entry.width;
                minSlideAmount = entry.slides;
            }
        });
        return minSlideAmount;
    };
    return Scroller;
}());
//# sourceMappingURL=Scroller.js.map