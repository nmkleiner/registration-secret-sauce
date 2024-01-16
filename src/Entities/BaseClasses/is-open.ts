export class IsOpen {
  public isOpen: boolean = false;

  public toggleIsOpen() {
    this.isOpen = !this.isOpen;
    return this;
  }

  public open() {
    this.isOpen = true;
    return this;
  }

  public close() {
    this.isOpen = false;
    return this;
  }
}
