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
  /** A function that is called when manual draggign ends */
  stopDragHandler?: Function;
  /** Automatically align the slider after scrolling or resizing if set to true */
  autoAlign?: boolean;
  /** This class will be applied to the container if there are too few slides to scroll the slider */
  noScrollClass?: string;
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

    if (options?.desktopClass && window.ontouchstart === undefined) {
      this.container.classList.add(options.desktopClass);
    }

    if (options?.nextPageHandler) {
      options.nextPageHandler.addEventListener("click", () => this.gotoRight());
    }

    if (options?.prevPageHandler) {
      options.prevPageHandler.addEventListener("click", () => this.gotoLeft());
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
      const nonScrollClass = options?.noScrollClass;
      this.setNoScrollableClass(nonScrollClass);
      window.addEventListener("resize", () => {
        this.setNoScrollableClass(nonScrollClass);
      });
    }
  }

  /**
   * Will check if the slider has in total more slides than visible per page
   * and will add/remove a class based on that information.
   * @param className The classname to add to the slider if no scrolling can take place
   */
  public setNoScrollableClass(className: string): void {
    const pos = this.checkIfEndStartReached();
    if (pos.isAtEnd && pos.isAtStart) {
      this.container.classList.add(className);
    } else {
      this.container.classList.remove(className);
    }
  }

  /**
   * Scroll to the previous page, if the current
   * position is at the end scroll to the first page
   */
  public gotoRight(): void {
    const isAtEnd = this.checkIfEndStartReached().isAtEnd;
    if (isAtEnd) return this.gotoElement(0);

    const closest = this.getClosestElement().index;
    const elementsPP = this.getElementPerPageAmount();
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
    const elementsPP = this.getElementPerPageAmount();
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
    let dragging: boolean = false;

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
      dragging = true;
    });

    document.addEventListener("mousemove", (e: MouseEvent) => {
      if (!dragging) return;
      e.preventDefault();
      const delta = clickPosX - e.clientX;
      this.container.style.scrollBehavior = "auto";
      this.container.scrollBy({ left: delta, behavior: "auto" });
      clickPosX = e.clientX;
    });

    this.container.addEventListener("click", (e: MouseEvent) => {
      const delta = Math.abs(staticClickPosX - e.clientX);
      if (delta > 10) e.preventDefault();
    });

    document.addEventListener("mouseup", (e: MouseEvent) => {
      if (dragging) {
        if (this.autoAlign) this.align();
        this.stopDragHandler(this);
      }
      dragging = false;
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
   * scroller simoutaniusly
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
}
