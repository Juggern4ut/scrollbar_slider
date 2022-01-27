interface ScrollerOptions {
  /** The class added to the container of the slider but only on non touch devices */
  desktopClass?: string;
  /** A HTMLElement that when clicked will progress the slider to the next slide */
  nextPageHandler?: HTMLElement | undefined;
  /** A HTMLElement that when clicked will revert the slider to the previous slide */
  prevPageHandler?: HTMLElement | undefined;
  /** After the given amount of milliseconds wil automatically advance to next slide. Disable with 0 */
  autoplay?: number;
}

export default class Scroller {
  /** The element containing the slider */
  container: HTMLElement;
  /** The interval responsible for autoplay */
  autoplayInterval: number = 0;
  /** The amount of milliseconds between autoplaying slides */
  autoplayDuration: number = 0;

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

    if (options?.desktopClass && window.ontouchstart === undefined) {
      this.container.classList.add(options.desktopClass);
    }

    if (options?.nextPageHandler) {
      options.nextPageHandler.addEventListener("click", () => this.gotoRight());
    }

    if (options?.prevPageHandler) {
      options.prevPageHandler.addEventListener("click", () => this.gotoLeft());
    }

    if (options?.autoplay && options?.autoplay > 0) {
      this.autoplayDuration = options.autoplay;
      this.initAutoplay();

      this.container.addEventListener("mousedown", () => this.clearAutoplay());
      this.container.addEventListener("touchstart", () => this.clearAutoplay());

      document.addEventListener("mouseup", () => this.initAutoplay());
      document.addEventListener("touchend", () => this.initAutoplay());
    }
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

  private clearAutoplay(): void {
    window.clearInterval(this.autoplayInterval);
    this.autoplayInterval = 0;
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
      this.gotoElement(this.container.children.length - 1);
    } else {
      this.gotoElement(currentPage + elementsPP);
    }
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
      this.gotoElement(0);
    } else {
      this.gotoElement(currentPage - elementsPP);
    }
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
   */
  private gotoElement(el: HTMLElement | number): void {
    console.log(el);

    if (typeof el === "number") {
      el = this.container.children[el] as HTMLElement;
    }

    const style = window.getComputedStyle(el);
    this.container.scroll({
      top: 0,
      left: el.offsetLeft - parseFloat(style.marginLeft),
      behavior: "smooth",
    });
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
}
