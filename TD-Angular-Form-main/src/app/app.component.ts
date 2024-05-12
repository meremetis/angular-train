import { Component, ViewChild } from '@angular/core';
import { FormControl, NgForm, NgModel } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  @ViewChild('f') formObject: NgForm;
  defaulSecret: String = 'teacher';
  answer: String = '';
  genders = ['male', 'female'];
  submitted: boolean = false;

  user: {
    username: string;
    email: string;
    secretQuestions: string;
    answer: string;
    gender: string;
  } = {
    username: '',
    email: '',
    secretQuestions: '',
    answer: '',
    gender: '',
  };

  suggestUserName() {
    const suggestedName = 'Superuser';
    // This overrides all the values
    // this.formObject.setValue({
    //   userData: {
    //     username: suggestedName,
    //     email: 'ff',
    //   },
    //   secret: 'pet',
    //   gender: 'male',
    //   questionAnswer: 'ffwewe',
    // });

    // this way we can override only specific parts of the form
    // patchValue is available only at the form object
    this.formObject.form.patchValue({
      userData: {
        username: suggestedName,
      },
    });
  }

  // onSubmit(form: NgForm) {
  //   console.log("submited", form);
  // }

  onSubmit() {
    console.log(this.formObject);
    this.submitted = true;
    this.user.username = this.formObject.value.userData.username;
    this.user.email = this.formObject.value.userData.email;
    this.user.secretQuestions = this.formObject.value.secret;
    this.user.answer = this.formObject.value.questionAnswer;
    this.user.gender = this.formObject.value.gender;

    // it also resets the state of the form aka. detached - dirty - valid etc
    this.formObject.reset();
  }

  validateCustomInput(ngModel: NgModel) {
    console.log(ngModel);

    const isValid = this.customValidator(ngModel.value);
    if (!isValid) {
      ngModel.control.setErrors({ invalidInput: true });
    } else {
      ngModel.control.setErrors(null);
    }
  }

  customValidator(value: string): boolean {
    // Perform your custom validation logic here
    return value && value.startsWith('abc');
  }
}
