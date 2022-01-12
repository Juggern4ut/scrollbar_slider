class Scroller {
  container: HTMLElement;
  items: HTMLCollection;

  constructor(selector: string) {
    this.container = document.querySelector(selector) as HTMLElement;
    this.items = this.container.children;
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
    const pageWidth = this.getSlideAmount() * slideWidth;
    const targetPage = Math.ceil((this.container.scrollLeft + 1) / pageWidth);
    this.container.scroll(targetPage * pageWidth, 0);
  }

  gotoLeft() {
    const firstSlide = this.items[0] as HTMLElement;
    const slideWidth = this.getTotalWidth(firstSlide);
    const pageWidth = this.getSlideAmount() * slideWidth;
    const targetPage = Math.floor((this.container.scrollLeft - 1) / pageWidth);
    this.container.scroll(targetPage * pageWidth, 0);
  }

  getSlideAmount(): number {
    const slide = this.items[0] as HTMLElement;
    const slideWidth = this.getTotalWidth(slide);
    const containerWidth = parseInt(
      window.getComputedStyle(this.container).width
    );
    return Math.round(containerWidth / slideWidth);
  }
}
