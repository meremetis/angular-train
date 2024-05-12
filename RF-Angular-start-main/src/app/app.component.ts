import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms'; // Import necessary Angular modules
import { AbstractControl, ValidatorFn } from '@angular/forms'; // Import AbstractControl and ValidatorFn for custom validation
import { Observable } from 'rxjs'; // Import Observable for handling asynchronous operations

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  genders = ['male', 'female']; // Define genders array
  signupForm: FormGroup; // Initialize signupForm as a FormGroup
  forbiddenUserNames: String[] = ['Chris', 'Anna']; // Define forbidden usernames array

  ngOnInit(): void {
    // Initialize signupForm and its controls
    this.signupForm = new FormGroup({
      userData: new FormGroup({
        // Define userData FormGroup with username and email FormControl
        username: new FormControl(null, [
          Validators.required, // Username is required
          // this.startsWithABCValidator(), // Uncomment this line if you want to use startsWithABCValidator
          this.courseValidatorForbiddenNames.bind(this), // Validate against forbidden usernames
        ]),
        email: new FormControl(
          null,
          [Validators.required, Validators.email], // Email is required and must be a valid email format
          this.forbiddenEmails // Async validation for forbidden emails
        ),
      }),
      gender: new FormControl('male'), // Initialize gender FormControl with default value 'male'
      hobbies: new FormArray([]), // Initialize hobbies as a FormArray
    });

    // Subscribe to status changes of signupForm
    this.signupForm.statusChanges.subscribe((data) => {
      console.log(data); // Log status changes to console
    });

    // Set initial values for signupForm
    this.signupForm.setValue({
      userData: {
        username: 'max', // Set default username
        email: 'mere.p.2hotmail.com', // Set default email
      },
      gender: 'male', // Set default gender
      hobbies: [], // Set hobbies as empty array
    });

    // Patch values for specific controls in signupForm
    this.signupForm.patchValue({
      userData: {
        username: 'panos', // Patch username to 'panos'
      },
    });
  }

  onSubmit() {
    console.log(this.signupForm); // Log signupForm data to console
    console.log(this.signupForm.get('userData.email')); // Log email FormControl value to console
    this.signupForm.reset(); // Reset signupForm
    // You can also pass an object to reset specific values
  }

  // Custom Validator Function to check if username starts with 'abc'
  startsWithABCValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const inputValue: string = control.value;
      if (inputValue && !inputValue.startsWith('abc')) {
        return { startsWithABC: { value: control.value } }; // Return error if username doesn't start with 'abc'
      }
      return null; // Validation passed
    };
  }

  // Method to add a hobby to the hobbies FormArray
  onAddHobby() {
    const control = new FormControl(null, Validators.required); // Create new FormControl for hobby with required validation
    (<FormArray>this.signupForm.get('hobbies')).push(control); // Push the new FormControl to hobbies FormArray
  }

  // Getter method to access controls of hobbies FormArray
  getControls() {
    return (<FormArray>this.signupForm.get('hobbies')).controls; // Return controls of hobbies FormArray
  }

  // Custom validator function to check if username is forbidden
  courseValidatorForbiddenNames(control: FormControl): {
    [s: string]: boolean;
  } {
    if (this.forbiddenUserNames.indexOf(control.value) !== -1) {
      return { nameIsForbidden: true }; // Return error if username is forbidden
    }

    // If validation is successful, return null
    return null;
  }

  // Async validators to check for forbidden emails
  forbiddenEmails(control: FormControl): Promise<any> | Observable<any> {
    const promise = new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        if (control.value === 'test@test.com') {
          resolve({ emailIsForbidden: true }); // Return error if email is forbidden
        } else {
          resolve(null); // Validation passed
        }
      }, 1000); // Simulate async operation with setTimeout
    });
    return promise; // Return the promise
  }
}
