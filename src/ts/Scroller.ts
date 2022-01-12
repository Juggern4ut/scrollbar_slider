class Scroller {
  container: HTMLElement;
  items: HTMLCollection;
  responsive: object[];
  defaultSlideAmount: number;

  constructor(selector: string, defaultSlides: number, responsive: object[]) {
    this.container = document.querySelector(selector) as HTMLElement;
    this.items = this.container.children;
    this.responsive = responsive;
    this.defaultSlideAmount = defaultSlides;
  }

  getTotalWidth(slide: HTMLElement): number {
    const styles = window.getComputedStyle(slide);
    return (
      parseInt(styles.marginRight) +
      parseInt(styles.marginLeft) +
      parseInt(styles.width)
    );
  }

  gotoRight() {
    const firstSlide = this.items[0] as HTMLElement;
    const slideWidth = this.getTotalWidth(firstSlide);
    const pageWidth = this.getSlideAmountFromResponsive() * slideWidth;
    const targetPage = Math.ceil((this.container.scrollLeft + 1) / pageWidth);
    this.container.scroll(targetPage * pageWidth, 0);
  }

  gotoLeft() {
    const firstSlide = this.items[0] as HTMLElement;
    const slideWidth = this.getTotalWidth(firstSlide);
    const pageWidth = this.getSlideAmountFromResponsive() * slideWidth;
    const targetPage = Math.floor((this.container.scrollLeft - 1) / pageWidth);
    this.container.scroll(targetPage * pageWidth, 0);
  }

  /**
   * Will return the amount of slides currently
   * displayed in the slider per page based on
   * the responsive settings
   * @returns The number of slides per Page
   */
  getSlideAmountFromResponsive(): number {
    const windowWidth = window.innerWidth;

    let minWW = Number.MAX_VALUE;
    let minSlideAmount = this.defaultSlideAmount;

    this.responsive.forEach((entry) => {
      if (entry.width < minWW && entry.width >= windowWidth) {
        minWW = entry.width;
        minSlideAmount = entry.slides;
      }
    });

    return minSlideAmount;
  }
}
