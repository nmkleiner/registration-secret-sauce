export class IsVisible {
  public isVisible: boolean = true;
  public label: string;

  public toggleIsVisible(): this {
    this.isVisible = !this.isVisible;
    return this;
  }

  public show(): this {
    this.isVisible = true;
    return this;
  }

  public hide(): this {
    this.isVisible = false;
    return this;
  }
}
