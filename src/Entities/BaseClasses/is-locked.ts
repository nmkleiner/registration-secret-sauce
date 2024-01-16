export class IsLocked {
  public isLocked: boolean = false;

  public lock() {
    this.isLocked = true;
    return this;
  }

  public unlock() {
    this.isLocked = false;
    return this;
  }
}
