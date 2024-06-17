import { Component, ComponentFactoryResolver, OnDestroy, ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";
import { AuthResponseData, AuthService } from "./auth.service";
import { Observable, Subscription } from "rxjs";
import { Router } from "@angular/router";
import { AlertComponent } from "../shared/alert/alert.component";
import { PlaceholderDirective } from "../shared/placeholder/placeholder.directive";

@Component({
  selector: "app-auth",
  templateUrl: "./auth.component.html",
})
export class AuthComponent implements OnDestroy{
  @ViewChild(PlaceholderDirective) alertHost: PlaceholderDirective;
  private closeSubscription: Subscription;

  isLogininMode = true;
  isLoading = false;
  error: string = null;

  constructor(private authService: AuthService, private route: Router, private componentFactoryResolver: ComponentFactoryResolver) {}

  inSwitchMode() {
    this.isLogininMode = !this.isLogininMode;
  }

  onSubmit(form: NgForm) {
    this.isLoading = true;

    if (!form.valid) {
      return;
    }
    const email = form.value.email;
    const password = form.value.password;

    let authObservable: Observable<AuthResponseData>;

    if (this.isLogininMode) {
      authObservable = this.authService.login(email, password);
    } else {
      authObservable = this.authService.signup(email, password);
    }

    authObservable.subscribe(
      (responseData) => {
        this.route.navigate(['/recipes']);
        this.isLoading = false;

      },
      (error) => {
        this.error = error;
        console.log(error);
        this.showErrorAlert(error);
        this.isLoading = false;
      },
      () => {
        this.isLoading = false;
      }
    );

    form.reset();
  }

  onHandleError() {
    this.error = null;
  }

  private showErrorAlert(message: string) {
    // const alertCom = AlertComponent();

    // this method returns an alert component factory
    // no the component its self
    const alertComponentFactory = this.componentFactoryResolver.resolveComponentFactory(AlertComponent);
    // i can use this factory to create an alert component
    // but i need to somehow tell angular where to attach it.


    const hostViewContainerRef = this.alertHost.viewContainerRef;
    hostViewContainerRef.clear();

    // here it creates the component in that place
    const componentRef = hostViewContainerRef.createComponent(alertComponentFactory);

    // we pass the message input here
    componentRef.instance.message = message;
    this.closeSubscription = componentRef.instance.close.subscribe(()=> {
      this.closeSubscription.unsubscribe();

      // to remove the component
      hostViewContainerRef.clear()
    })
  }

  ngOnDestroy(): void {
    if (this.closeSubscription) {
      this.closeSubscription.unsubscribe();
    }
  }
}
