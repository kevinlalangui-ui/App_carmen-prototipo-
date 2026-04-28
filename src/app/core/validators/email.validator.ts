import {AbstractControl, ValidationErrors} from "@angular/forms";

export function EmailValidator(control: AbstractControl): null | ValidationErrors {

    const value = control.value;

    if (!value) {
        return null;
    }

    // El return ValidationErrors retorna un {clave: valor}, donde la clave es el nombre del error
    // para cogerlo en el html, y el value si hay error o no
    //camilo@gmail.com

    // Comprobar extensión
    // -> return {extension: true}
    const regex1_opt = /^[a-z\d]+@(gmail|hotmail)(\.)[a-z\d]+$/i;
    const regex1 = /@(gmail|hotmail)(\.)/;

    if (!regex1.test(value)) {
        return {extension: true}
    }

    // Comprobar el correo completo
    // -> return {customEmail: true}
    const regex2 = /^[a-z0-9._-]{3,}(@)(gmail|hotmail)(\.)(com|es)$/i;
    return regex2.test(value) ? null : {customEmail: true};

}


