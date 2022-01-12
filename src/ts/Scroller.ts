class Scroller {
  container: HTMLElement;
  items: HTMLCollection;

  constructor(selector: string) {
    this.container = document.querySelector(selector) as HTMLElement;
    this.items = this.container.children;
  }

  /**
   * Will calculate the width of a given Element
   * including horizontal margins
   * @param slide The slide to calculate the width of
   * @returns The width of the slide including margins
   */
  getTotalWidth(slide: HTMLElement): number {
    const styles = window.getComputedStyle(slide);
    return (
      parseInt(styles.marginRight) +
      parseInt(styles.marginLeft) +
      parseInt(styles.width)
    );
  }

  /**
   * Scroll to the next page
   */
  gotoRight(): void {
    this.goto(false);
  }

  /**
   * Scroll to the previous page
   */
  gotoLeft(): void {
    this.goto(true);
  }

  /**
   * Will scroll the slider either right or left
   * to the next page, depending on the given parameter
   * @param left If set to true, the slider will scroll left, and right otherwise
   */
  goto(left: boolean = false) {
    const firstSlide = this.items[0] as HTMLElement;
    const slideWidth = this.getTotalWidth(firstSlide);
    const pageWidth = this.getElementsPerPage() * slideWidth;
    const targetPage = left
      ? Math.floor((this.container.scrollLeft - 1) / pageWidth)
      : Math.ceil((this.container.scrollLeft + 1) / pageWidth);
    this.container.scroll(targetPage * pageWidth, 0);
  }

  /**
   * Will return the number of Elements that can
   * be simoutaniusly displayed per Page
   * @returns The number of elements per Page
   */
  getElementsPerPage(): number {
    const slide = this.items[0] as HTMLElement;
    const slideWidth = this.getTotalWidth(slide);
    const containerWidth = parseInt(
      window.getComputedStyle(this.container).width
    );
    return Math.round(containerWidth / slideWidth);
  }
}
