import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Subject, throwError } from "rxjs";
import { catchError, tap } from "rxjs/operators";
import { HttpErrorResponse } from "./error.model";
import { User } from "./user.model";

export interface AuthResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable({
  providedIn: "root",
})
export class AuthService {
  user = new Subject<User>();
  constructor(private http: HttpClient) {}
  signup(email: string, password: string) {
    const credentials = {
      email: email,
      password: password,
      returnSecureToken: true,
    };
    return this.http
      .post<AuthResponseData>(
        "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyA8j-g2R9xfZ8NzVvnVUNtbmGSc4w_QJK8",
        credentials
      )
      .pipe(catchError(this.handleError), tap(this.handleAuthentication));
  }

  login(email: string, password: string) {
    const credentials = {
      email: email,
      password: password,
      returnSecureToken: true,
    };

    return this.http
      .post<AuthResponseData>(
        "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyA8j-g2R9xfZ8NzVvnVUNtbmGSc4w_QJK8",
        credentials
      )
      .pipe(catchError(this.handleError), tap(this.handleAuthentication));
  }

  private handleAuthentication(email: string, userId: string, token: string, expiresIn: number) {
    // first we get the currect time
    // then we add the time of expiration after we mulitply it with 1000 because expiresin is in seconds and we want it into mili seconds.
    const expirationDate = new Date(
      new Date().getTime() + expiresIn * 1000
    );
    const user = new User(
      email.email,
      userId.localId,
      token.idToken,
      expirationDate
    );
    this.user.next(user);
  }

  private handleError(errorResponse: HttpErrorResponse) {
    let errorMessage = "Unknown error occurred";
    if (!errorResponse.error || !errorResponse.error.error) {
      return throwError(errorMessage);
    }

    switch (errorResponse.error.error.message) {
      case "EMAIL_EXISTS":
        errorMessage = "This email exists already";
        break;

      case "INVALID_EMAIL":
        errorMessage = "This email is invalid";
        break;

      case "INVALID_LOGIN_CREDENTIALS":
        errorMessage = "Please add valid credentials";
        break;

      case "EMAIL_NOT_FOUND":
        errorMessage =
          "There is no user record corresponding to this identifier. The user may have been deleted.";
        break;

      case "INVALID_PASSWORD":
        errorMessage =
          "The password is invalid or the user does not have a password.";
        break;
    }

    return throwError(errorMessage);
  }
}
