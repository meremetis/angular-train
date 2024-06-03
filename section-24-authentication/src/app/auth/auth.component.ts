import { Component } from "@angular/core";
import { NgForm } from "@angular/forms";
import { AuthResponseData, AuthService } from "./auth.service";
import { Observable } from "rxjs";

@Component({
  selector: "app-auth",
  templateUrl: "./auth.component.html",
})
export class AuthComponent {
  isLogininMode = true;
  isLoading = false;
  error: string = null;

  constructor(private authService: AuthService) {}

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
        console.log(responseData);
        console.log(this.isLoading);
        this.isLoading = false;
      },
      (error) => {
        this.error = error;
        console.log(error);
        this.isLoading = false;
      },
      () => {
        this.isLoading = false;
      }
    );

    form.reset();
  }
}
