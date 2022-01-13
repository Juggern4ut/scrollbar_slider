export default class Scroller {
  container: HTMLElement;
  items: HTMLCollection;

  constructor(selector: string) {
    this.container = document.querySelector(selector) as HTMLElement;
    this.items = this.container.children;
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
    if (cont.offsetWidth + cont.scrollLeft > cont.scrollWidth - 100) return 0;
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
    if (cont.scrollLeft < 100) return cont.scrollWidth;
    const tmpPage = Math.floor((cont.scrollLeft - 1) / cont.offsetWidth);
    return tmpPage * cont.offsetWidth;
  }
}
