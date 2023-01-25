"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Scroller = /** @class */ (function () {
    /**
     * Will create a new horizontal slider on the given selector using
     * the options passed to the constructor
     * @param sel The selector to find the container of the slider
     * @param options The options used to build the slider (optional)
     */
    function Scroller(sel, options) {
        var _this = this;
        /** The interval responsible for autoplay */
        this.autoplayInterval = 0;
        /** The amount of milliseconds between autoplaying slides */
        this.autoplayDuration = 0;
        /** A function that is called when manual draggign ends */
        this.stopDragHandler = function () { };
        /** The index of the currently most left visible element */
        this.currentElement = 0;
        /** Will be called when the slide changes */
        this.onChange = function () { return null; };
        if (typeof sel === "string")
            this.container = document.querySelector(sel);
        else
            this.container = sel;
        if (!this.container) {
            console.warn("Slider not initialized! Container '".concat(sel, "' not found!"));
            return;
        }
        if ((options === null || options === void 0 ? void 0 : options.desktopClass) && window.ontouchstart === undefined) {
            this.container.classList.add(options.desktopClass);
        }
        if (options === null || options === void 0 ? void 0 : options.nextPageHandler) {
            options.nextPageHandler.addEventListener("click", function () {
                _this.gotoRight();
                _this.resetAutoplay();
            });
        }
        if (options === null || options === void 0 ? void 0 : options.prevPageHandler) {
            options.prevPageHandler.addEventListener("click", function () {
                _this.gotoLeft();
                _this.resetAutoplay();
            });
        }
        if (options === null || options === void 0 ? void 0 : options.autoAlign) {
            this.autoAlign = options.autoAlign;
            this.initializeResizeAlign();
        }
        if ((options === null || options === void 0 ? void 0 : options.autoplay) && (options === null || options === void 0 ? void 0 : options.autoplay) > 0) {
            this.autoplayDuration = options.autoplay;
            this.initAutoplay();
            this.container.addEventListener("mousedown", function () { return _this.clearAutoplay(); });
            this.container.addEventListener("touchstart", function () { return _this.clearAutoplay(); });
            document.addEventListener("mouseup", function () { return _this.initAutoplay(); });
            document.addEventListener("touchend", function () { return _this.initAutoplay(); });
        }
        if (options === null || options === void 0 ? void 0 : options.mouseScrolling) {
            this.initializeMouseScrolling();
            this.mouseDragCallback = options.mouseDragCallback;
            if (options === null || options === void 0 ? void 0 : options.dragSnapDistance) {
                this.snapDragDistance = options.dragSnapDistance;
                this.snapDragHard = options.dragSnapHard;
            }
        }
        if (options === null || options === void 0 ? void 0 : options.stopDragHandler) {
            this.stopDragHandler = options === null || options === void 0 ? void 0 : options.stopDragHandler;
        }
        this.container.addEventListener("scroll", function () {
            var currentClosest = _this.getClosestElement().index;
            if (currentClosest !== _this.currentElement) {
                _this.currentElement = currentClosest;
                _this.onChange(_this.currentElement);
            }
        });
        if (options === null || options === void 0 ? void 0 : options.noScrollClass) {
            var nonScrollClass_1 = options === null || options === void 0 ? void 0 : options.noScrollClass;
            this.setNoScrollableClass(nonScrollClass_1);
            window.addEventListener("resize", function () {
                _this.setNoScrollableClass(nonScrollClass_1);
            });
        }
    }
    /**
     * Will check if the slider has in total more slides than visible per page
     * and will add/remove a class based on that information.
     * @param className The classname to add to the slider if no scrolling can take place
     */
    Scroller.prototype.setNoScrollableClass = function (className) {
        if (!this.isScrollable()) {
            this.container.classList.add(className);
        }
        else {
            this.container.classList.remove(className);
        }
    };
    /**
     * Will check if the slider is able to scroll due to amount of slides
     * and will return either true or false
     * @returns true if the slider can be scrolled, false otherwise
     */
    Scroller.prototype.isScrollable = function () {
        var pos = this.checkIfEndStartReached();
        return !pos.isAtEnd || !pos.isAtStart;
    };
    /**
     * Scroll to the previous page, if the current
     * position is at the end scroll to the first page
     */
    Scroller.prototype.gotoRight = function () {
        var isAtEnd = this.checkIfEndStartReached().isAtEnd;
        if (isAtEnd)
            return this.gotoElement(0);
        var closest = this.getClosestElement().index;
        var elementsPP = this.getElementPerPageAmount();
        var currentPage = Math.floor(closest / elementsPP) * elementsPP;
        if (currentPage + elementsPP >= this.container.children.length) {
            return this.gotoElement(0);
        }
        return this.gotoElement(currentPage + elementsPP);
    };
    /**
     * Scroll to the previous page, if the current
     * position is 0 scroll to the last page
     */
    Scroller.prototype.gotoLeft = function () {
        var isAtStart = this.checkIfEndStartReached().isAtStart;
        if (isAtStart)
            return this.gotoElement(this.container.children.length - 1);
        var closest = this.getClosestElement().index;
        var elementsPP = this.getElementPerPageAmount();
        var currentPage = Math.ceil(closest / elementsPP) * elementsPP;
        if (currentPage - elementsPP < 0) {
            return this.gotoElement(this.container.children.length - 1);
        }
        return this.gotoElement(currentPage - elementsPP);
    };
    /**
     * Aligns the slider to the closest slide
     * so no slides are cut off
     * @param instant Jump instantly to the closest Element
     */
    Scroller.prototype.align = function (instant) {
        this.gotoElement(this.getClosestElement().index, instant);
    };
    /**
     * If called, allows the user to scroll the slider on desktop
     * by clicking and dragging with the mouse
     */
    Scroller.prototype.initializeMouseScrolling = function () {
        var _this = this;
        /** Ignore on touch devices */
        if (window.ontouchstart !== undefined)
            return;
        var staticClickPosX;
        var clickPosX;
        this.isDragging = false;
        /** Prevent selection on container due to unwanted effects */
        this.container.style.userSelect = "none";
        var prevElements = this.container.querySelectorAll("a, img");
        prevElements.forEach(function (el) {
            var i = el;
            i.ondragstart = function (e) { return e.preventDefault(); };
        });
        this.container.addEventListener("mousedown", function (e) {
            staticClickPosX = e.clientX;
            clickPosX = e.clientX;
            _this.isDragging = true;
        });
        document.addEventListener("mousemove", function (e) {
            if (!_this.isDragging)
                return;
            e.preventDefault();
            var delta = clickPosX - e.clientX;
            var staticDelta = staticClickPosX - e.clientX;
            _this.container.style.scrollBehavior = "auto";
            if (!_this.snapDragHard) {
                _this.container.scrollBy({ left: delta, behavior: "auto" });
            }
            if (_this.mouseDragCallback) {
                _this.mouseDragCallback(_this, staticClickPosX - e.clientX);
            }
            if (_this.snapDragDistance && staticDelta > _this.snapDragDistance) {
                _this.gotoRight();
                _this.isDragging = false;
            }
            else if (_this.snapDragDistance &&
                staticDelta < _this.snapDragDistance * -1) {
                _this.gotoLeft();
                _this.isDragging = false;
            }
            clickPosX = e.clientX;
        });
        this.container.addEventListener("click", function (e) {
            var delta = Math.abs(staticClickPosX - e.clientX);
            if (delta > 10)
                e.preventDefault();
        });
        document.addEventListener("mouseup", function (e) {
            if (_this.isDragging) {
                if (_this.autoAlign)
                    _this.align();
                _this.stopDragHandler(_this);
            }
            _this.isDragging = false;
        });
    };
    /**
     * Inizialize the window resize eventListener which will
     * align the slides if set in the options
     */
    Scroller.prototype.initializeResizeAlign = function () {
        var _this = this;
        window.addEventListener("resize", function () {
            if (_this.autoAlign)
                _this.align(true);
        });
    };
    /**
     * Will calculate the amount of elements that can be shown in the
     * scroller simoutaniusly
     * @returns The number of elements that completely fit into a slide
     */
    Scroller.prototype.getElementPerPageAmount = function () {
        var firstElement = this.container.children[0];
        var style = window.getComputedStyle(firstElement);
        var margins = parseInt(style.marginLeft) + parseInt(style.marginRight);
        var totalSlideWidth = firstElement.offsetWidth + margins;
        return Math.floor(this.container.offsetWidth / totalSlideWidth);
    };
    /**
     * Will advance the slider to a given element or index
     * @param el The element (or index) to advance to
     * @param instant Jump instantly to the given element
     */
    Scroller.prototype.gotoElement = function (el, instant) {
        if (typeof el === "number") {
            el = this.container.children[el];
        }
        if (!el)
            return;
        if (instant)
            this.container.style.scrollBehavior = "auto";
        var style = window.getComputedStyle(el);
        this.container.scroll({
            top: 0,
            left: el.offsetLeft - parseFloat(style.marginLeft),
            behavior: instant ? "auto" : "smooth",
        });
        if (instant)
            this.container.style.scrollBehavior = "smooth";
    };
    /**
     * Will check if the slideshow currently is at the very end
     * or beginning and return an object containing two booleans
     * @returns An object containing two booleans indicating weather the start or end of the slideshow has been reached
     */
    Scroller.prototype.checkIfEndStartReached = function () {
        var scrollLeft = this.container.scrollLeft;
        var offsetWidth = this.container.offsetWidth;
        var scrollWidth = this.container.scrollWidth;
        return {
            isAtStart: scrollLeft === 0,
            isAtEnd: scrollLeft + offsetWidth >= scrollWidth,
        };
    };
    /**
     * Will return the index of the slide that is currently
     * the closest to the left border of the Slideshow
     * @returns The index of calculated slide
     */
    Scroller.prototype.getClosestElement = function () {
        var scrollLeft = this.container.scrollLeft;
        var children = this.container.children;
        var delta = Number.MAX_SAFE_INTEGER;
        var closestSlide = 0;
        for (var i = 0; i < children.length; i++) {
            var child = this.container.children[i];
            var tmpDelta = Math.abs(scrollLeft - child.offsetLeft);
            if (tmpDelta < delta) {
                delta = tmpDelta;
                closestSlide = i;
            }
        }
        return {
            index: closestSlide,
            el: this.container.children[closestSlide],
        };
    };
    /**
     * Initialize the autoplay interval
     */
    Scroller.prototype.initAutoplay = function () {
        var _this = this;
        if (this.autoplayInterval !== 0)
            return;
        this.autoplayInterval = window.setInterval(function () {
            _this.gotoRight();
        }, this.autoplayDuration);
    };
    /**
     * Will stop the autoplay interval. This is used when the user
     * is manually scrolling the slideshow to not interfere with the
     * user input
     */
    Scroller.prototype.clearAutoplay = function () {
        window.clearInterval(this.autoplayInterval);
        this.autoplayInterval = 0;
    };
    /**
     * Can be used to restart the autoplay interval. This will be used for
     * example when the next/prev-Buttons are clicked
     */
    Scroller.prototype.resetAutoplay = function () {
        if (this.autoplayDuration && this.autoplayDuration > 0) {
            this.clearAutoplay();
            this.initAutoplay();
        }
    };
    return Scroller;
}());
exports.default = Scroller;
//# sourceMappingURL=Scroller.js.map