interface ScrollerOptions {
  /** The class added to the container of the slider but only on non touch devices */
  desktopClass?: string;
  /** A HTMLElement that when clicked will progress the slider to the next slide */
  nextPageHandler?: HTMLElement | undefined;
  /** A HTMLElement that when clicked will revert the slider to the previous slide */
  prevPageHandler?: HTMLElement | undefined;
}

export default class Scroller {
  /** The element containing the slider */
  container: HTMLElement;

  /**
   * Will create a new horizontal slider on the given selector using
   * the options passed to the constructor
   * @param selector The selector to find the container of the slider
   * @param options The options used to build the slider (optional)
   */
  constructor(selector: string | HTMLElement, options?: ScrollerOptions) {
    if (typeof selector === "string") {
      this.container = document.querySelector(selector) as HTMLElement;
    } else {
      this.container = selector;
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
  }

  /**
   * Scroll to the previous page, if the current
   * position is at the end scroll to the first page
   */
  public gotoRight(): void {
    this.container.scroll({
      top: 0,
      left: this.getNextPagePosition(),
      behavior: "smooth",
    });
  }

  /**
   * Scroll to the previous page, if the current
   * position is 0 scroll to the last page
   */
  public gotoLeft(): void {
    this.container.scroll({
      top: 0,
      left: this.getPrevPagePosition(),
      behavior: "smooth",
    });
  }

  /**
   * Will calculate the scroll position of the next
   * page. If the slider is at the very end, will return
   * 0 so the slider can loop
   * @returns The scrollPosition of the next page
   */
  private getNextPagePosition(): number {
    const cont = this.container;
    if (cont.offsetWidth + cont.scrollLeft > cont.scrollWidth - 25) return 0;
    const tmpPage = Math.ceil((cont.scrollLeft + 1) / cont.offsetWidth);
    return tmpPage * cont.offsetWidth;
  }

  /**
   * Will calculate the scroll position of the previous
   * page. If the slider is at the very beginning, will return
   * the positon of the last page so the slider can loop
   */
  private getPrevPagePosition(): number {
    const cont = this.container;
    if (cont.scrollLeft < 25) return cont.scrollWidth;
    const tmpPage = Math.floor((cont.scrollLeft - 1) / cont.offsetWidth);
    return tmpPage * cont.offsetWidth;
  }
}
