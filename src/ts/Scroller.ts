interface ScrollerOptions {
  /** The class added to the container of the slider but only on non touch devices */
  desktopClass?: string;
  /** A HTMLElement that when clicked will progress the slider to the next slide */
  nextPageHandler?: HTMLElement | undefined;
  /** A HTMLElement that when clicked will revert the slider to the previous slide */
  prevPageHandler?: HTMLElement | undefined;
  /** After the given amount of milliseconds wil automatically advance to next slide. Disable with 0 */
  autoplay?: number;
  /** If set to true, will allow scrolling via mouse drag on desktop */
  mouseScrolling?: boolean;
  /** Function that is called whenever the slider is dragged with the mouse */
  mouseDragCallback?: Function;
  /** A function that is called when manual draggign ends */
  stopDragHandler?: Function;
  /** Automatically align the slider after scrolling or resizing if set to true */
  autoAlign?: boolean;
  /** This class will be applied to the container if there are too few slides to scroll the slider */
  noScrollClass?: string;
  /** If mouseScrolling is active the slider will instantly jump to the next/previous slide if the distance set here is reached */
  dragSnapDistance?: number;
  /** If set to true, the slideshow will not drag along with the cursor but jump straight to the next slide after the dragSnapDistance is reached */
  dragSnapHard?: boolean;
  /** Amount of elements to slide using the gotoLeft and gotoRight methods */
  elementsToScroll?: number;
}

export default class Scroller {
  /** The element containing the slider */
  container: HTMLElement;
  /** The interval responsible for autoplay */
  autoplayInterval: number = 0;
  /** The amount of milliseconds between autoplaying slides */
  autoplayDuration: number = 0;
  /** A function that is called when manual draggign ends */
  stopDragHandler: Function = () => {};
  /** Automatically align the slider after scrolling or resizing if set to true*/
  autoAlign?: boolean;
  /** The index of the currently most left visible element */
  currentElement: number = 0;
  /** Will be called when the slide changes */
  onChange: Function = () => null;
  /** Function that is called whenever the slider is dragged with the mouse */
  mouseDragCallback?: Function;
  /** A Boolean representing if the user is currently dragging the slider */
  isDragging?: boolean;
  /** If mouseScrolling is active the slider will instantly jump to the next/previous slide if the distance set here is reached */
  snapDragDistance?: number;
  /** If set to true, the slideshow will not drag along with the cursor but jump straight to the next slide after the dragSnapDistance is reached */
  snapDragHard?: boolean;
  /** Amount of elements to slide using the gotoLeft and gotoRight methods */
  elementsToScroll?: number;
  /** This class will be applied to the container if there are too few slides to scroll the slider */
  noScrollClass?: string;

  /**
   * Will create a new horizontal slider on the given selector using
   * the options passed to the constructor
   * @param sel The selector to find the container of the slider
   * @param options The options used to build the slider (optional)
   */
  constructor(sel: string | HTMLElement, options?: ScrollerOptions) {
    if (typeof sel === "string")
      this.container = document.querySelector(sel) as HTMLElement;
    else this.container = sel;

    if (!this.container) {
      console.warn(`Slider not initialized! Container '${sel}' not found!`);
      return;
    }

    if (this.container.getAttribute("scrollerSlider") === "true") {
      console.warn(
        `Slider on ${sel} already initialized! No further actions taken!`
      );
      return;
    }

    if (options?.desktopClass && window.ontouchstart === undefined) {
      this.container.classList.add(options.desktopClass);
    }

    if (options?.elementsToScroll) {
      this.elementsToScroll = options.elementsToScroll;
    }

    if (options?.nextPageHandler) {
      options.nextPageHandler.addEventListener("click", () => {
        this.gotoRight();
        this.resetAutoplay();
      });
    }

    if (options?.prevPageHandler) {
      options.prevPageHandler.addEventListener("click", () => {
        this.gotoLeft();
        this.resetAutoplay();
      });
    }

    if (options?.autoAlign) {
      this.autoAlign = options.autoAlign;
      this.initializeResizeAlign();
    }

    if (options?.autoplay && options?.autoplay > 0) {
      this.autoplayDuration = options.autoplay;
      this.initAutoplay();

      this.container.addEventListener("mousedown", () => this.clearAutoplay());
      this.container.addEventListener("touchstart", () => this.clearAutoplay());

      document.addEventListener("mouseup", () => this.initAutoplay());
      document.addEventListener("touchend", () => this.initAutoplay());
    }

    if (options?.mouseScrolling) {
      this.initializeMouseScrolling();
      this.mouseDragCallback = options.mouseDragCallback;
      if (options?.dragSnapDistance) {
        this.snapDragDistance = options.dragSnapDistance;
        this.snapDragHard = options.dragSnapHard;
      }
    }

    if (options?.stopDragHandler) {
      this.stopDragHandler = options?.stopDragHandler;
    }

    this.container.addEventListener("scroll", () => {
      const currentClosest = this.getClosestElement().index;
      if (currentClosest !== this.currentElement) {
        this.currentElement = currentClosest;
        this.onChange(this.currentElement);
      }
    });

    if (options?.noScrollClass) {
      this.noScrollClass = options.noScrollClass;
      this.setNoScrollableClass();
      window.addEventListener("resize", () => {
        this.setNoScrollableClass();
      });
    }

    this.initMutationObserver();
    this.container.setAttribute("scrollerSlider", "true");
  }

  /**
   * Initializes a new MutationObserver that is triggered as soon
   * as the children/slides of the slider get changed from anywhere
   */
  private initMutationObserver(): void {
    var mo = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "childList") {
          this.setNoScrollableClass();
        }
      });
    });
    mo.observe(this.container, { childList: true });
  }

  /**
   * Will check if the slider has in total more slides than visible per page
   * and will add/remove a class based on that information.
   * @param className The classname to add to the slider if no scrolling can take place
   */
  public setNoScrollableClass(): void {
    if (!this.noScrollClass) return;
    if (!this.isScrollable()) {
      this.container.classList.add(this.noScrollClass);
    } else {
      this.container.classList.remove(this.noScrollClass);
    }
  }

  /**
   * Will check if the slider is able to scroll due to amount of slides
   * and will return either true or false
   * @returns true if the slider can be scrolled, false otherwise
   */
  public isScrollable(): boolean {
    const pos = this.checkIfEndStartReached();
    return !pos.isAtEnd || !pos.isAtStart;
  }

  /**
   * Scroll to the previous page, if the current
   * position is at the end scroll to the first page
   */
  public gotoRight(): void {
    const isAtEnd = this.checkIfEndStartReached().isAtEnd;
    if (isAtEnd) return this.gotoElement(0);

    const closest = this.getClosestElement().index;
    const elementsPP = this.elementsToScroll || this.getElementPerPageAmount();
    const currentPage = Math.floor(closest / elementsPP) * elementsPP;

    if (currentPage + elementsPP >= this.container.children.length) {
      return this.gotoElement(0);
    }

    return this.gotoElement(currentPage + elementsPP);
  }

  /**
   * Scroll to the previous page, if the current
   * position is 0 scroll to the last page
   */
  public gotoLeft(): void {
    const isAtStart = this.checkIfEndStartReached().isAtStart;
    if (isAtStart) return this.gotoElement(this.container.children.length - 1);

    const closest = this.getClosestElement().index;
    const elementsPP = this.elementsToScroll || this.getElementPerPageAmount();
    const currentPage = Math.ceil(closest / elementsPP) * elementsPP;

    if (currentPage - elementsPP < 0) {
      return this.gotoElement(this.container.children.length - 1);
    }

    return this.gotoElement(currentPage - elementsPP);
  }

  /**
   * Aligns the slider to the closest slide
   * so no slides are cut off
   * @param instant Jump instantly to the closest Element
   */
  public align(instant?: boolean): void {
    this.gotoElement(this.getClosestElement().index, instant);
  }

  /**
   * If called, allows the user to scroll the slider on desktop
   * by clicking and dragging with the mouse
   */
  private initializeMouseScrolling(): void {
    /** Ignore on touch devices */
    if (window.ontouchstart !== undefined) return;

    let staticClickPosX: number;
    let clickPosX: number;
    this.isDragging = false;

    /** Prevent selection on container due to unwanted effects */
    this.container.style.userSelect = "none";

    const prevElements = this.container.querySelectorAll("a, img");
    prevElements.forEach((el: Element) => {
      const i = el as HTMLElement;
      i.ondragstart = (e) => e.preventDefault();
    });

    this.container.addEventListener("mousedown", (e: MouseEvent) => {
      staticClickPosX = e.clientX;
      clickPosX = e.clientX;
      this.isDragging = true;
    });

    document.addEventListener("mousemove", (e: MouseEvent) => {
      if (!this.isDragging) return;
      e.preventDefault();
      const delta = clickPosX - e.clientX;
      const staticDelta = staticClickPosX - e.clientX;
      this.container.style.scrollBehavior = "auto";

      if (!this.snapDragHard) {
        this.container.scrollBy({ left: delta, behavior: "auto" });
      }

      if (this.mouseDragCallback) {
        this.mouseDragCallback(this, staticClickPosX - e.clientX);
      }

      if (this.snapDragDistance && staticDelta > this.snapDragDistance) {
        this.gotoRight();
        this.isDragging = false;
      } else if (
        this.snapDragDistance &&
        staticDelta < this.snapDragDistance * -1
      ) {
        this.gotoLeft();
        this.isDragging = false;
      }

      clickPosX = e.clientX;
    });

    this.container.addEventListener("click", (e: MouseEvent) => {
      const delta = Math.abs(staticClickPosX - e.clientX);
      if (delta > 10) e.preventDefault();
    });

    document.addEventListener("mouseup", (e: MouseEvent) => {
      if (this.isDragging) {
        if (this.autoAlign) this.align();
        this.stopDragHandler(this);
      }
      this.isDragging = false;
    });
  }

  /**
   * Inizialize the window resize eventListener which will
   * align the slides if set in the options
   */
  private initializeResizeAlign(): void {
    window.addEventListener("resize", () => {
      if (this.autoAlign) this.align(true);
    });
  }

  /**
   * Will calculate the amount of elements that can be shown in the
   * scroller simultaneously
   * @returns The number of elements that completely fit into a slide
   */
  private getElementPerPageAmount(): number {
    const firstElement = this.container.children[0] as HTMLElement;
    const style = window.getComputedStyle(firstElement);
    const margins = parseInt(style.marginLeft) + parseInt(style.marginRight);
    const totalSlideWidth = firstElement.offsetWidth + margins;
    return Math.floor(this.container.offsetWidth / totalSlideWidth);
  }

  /**
   * Will advance the slider to a given element or index
   * @param el The element (or index) to advance to
   * @param instant Jump instantly to the given element
   */
  private gotoElement(el: HTMLElement | number, instant?: boolean): void {
    if (typeof el === "number") {
      el = this.container.children[el] as HTMLElement;
    }

    if (!el) return;

    if (instant) this.container.style.scrollBehavior = "auto";

    const style = window.getComputedStyle(el);
    this.container.scroll({
      top: 0,
      left: el.offsetLeft - parseFloat(style.marginLeft),
      behavior: instant ? "auto" : "smooth",
    });

    if (instant) this.container.style.scrollBehavior = "smooth";
  }

  /**
   * Will check if the slideshow currently is at the very end
   * or beginning and return an object containing two booleans
   * @returns An object containing two booleans indicating weather the start or end of the slideshow has been reached
   */
  private checkIfEndStartReached(): { isAtStart: boolean; isAtEnd: boolean } {
    const scrollLeft = this.container.scrollLeft;
    const offsetWidth = this.container.offsetWidth;
    const scrollWidth = this.container.scrollWidth;

    return {
      isAtStart: scrollLeft === 0,
      isAtEnd: scrollLeft + offsetWidth >= scrollWidth,
    };
  }

  /**
   * Will return the index of the slide that is currently
   * the closest to the left border of the Slideshow
   * @returns The index of calculated slide
   */
  private getClosestElement(): { index: number; el: HTMLElement } {
    const scrollLeft = this.container.scrollLeft;
    const children = this.container.children;
    let delta = Number.MAX_SAFE_INTEGER;
    let closestSlide: number = 0;

    for (let i = 0; i < children.length; i++) {
      const child = this.container.children[i] as HTMLElement;
      const tmpDelta = Math.abs(scrollLeft - child.offsetLeft);
      if (tmpDelta < delta) {
        delta = tmpDelta;
        closestSlide = i;
      }
    }

    return {
      index: closestSlide,
      el: this.container.children[closestSlide] as HTMLElement,
    };
  }

  /**
   * Initialize the autoplay interval
   */
  private initAutoplay(): void {
    if (this.autoplayInterval !== 0) return;
    this.autoplayInterval = window.setInterval(() => {
      this.gotoRight();
    }, this.autoplayDuration);
  }

  /**
   * Will stop the autoplay interval. This is used when the user
   * is manually scrolling the slideshow to not interfere with the
   * user input
   */
  private clearAutoplay(): void {
    window.clearInterval(this.autoplayInterval);
    this.autoplayInterval = 0;
  }

  /**
   * Can be used to restart the autoplay interval. This will be used for
   * example when the next/prev-Buttons are clicked
   */
  public resetAutoplay(): void {
    if (this.autoplayDuration && this.autoplayDuration > 0) {
      this.clearAutoplay();
      this.initAutoplay();
    }
  }
}
