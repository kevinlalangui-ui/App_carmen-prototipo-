import {AbstractControl, ValidationErrors} from "@angular/forms";

export function DniValidator(control: AbstractControl): null | ValidationErrors {

  const value:string = control.value;

  if (!value) {
    return null;
  }

  //regex utilizado
  const regex1 = /^[0-9]{8}[A-Z]$/i;
  if (!regex1.test(value)) {
    return {extension: true}
  }

  return null;

}
