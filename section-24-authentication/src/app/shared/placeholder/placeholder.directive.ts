import { Directive, ViewContainerRef } from "@angular/core";

@Directive({
  // attribute selector
  selector: "[appPlaceholder]",
})
export class PlaceholderDirective {
  // public because we need to access it from outside.
  constructor(public viewContainerRef: ViewContainerRef) {}
}
