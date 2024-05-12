import { Directive } from '@angular/core';
import { NG_VALIDATORS, Validator, AbstractControl } from '@angular/forms';

@Directive({
  selector: '[customValidator]',
  providers: [{ provide: NG_VALIDATORS, useExisting: CustomValidatorDirective, multi: true }]
})
export class CustomValidatorDirective implements Validator  {
  validate(control: AbstractControl): { [key: string]: any } | null {
    // Implement your custom validation logic here
    if (!control.value.startsWith('abc')) {
      return { 'customValidation': true }; // Validation failed
    }
    return null; // Validation passed
  }

}
