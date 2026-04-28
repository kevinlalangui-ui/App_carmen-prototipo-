import {Injectable} from '@angular/core';
import Swal from 'sweetalert2'

@Injectable({
    providedIn: 'root',
})
export class AlertasService {

    showLoader(title: string = "Cargando...", description: string = "Espere unos segundos") {
        Swal.fire({
            title: title,
            text: description,
            showConfirmButton: false,
            allowOutsideClick: false,
            allowEscapeKey: false,
            didOpen: () => {
                Swal.showLoading()
            }
        })
    }

    confirm(title: string,
            description: string,
            confirmText: string = "¿Esta seguro?",
            cancelText: string = "Cancelar",
            icon: "warning" | "info" | "error" | "success"): void {

    }

    alert(title: string,
          description: string,
          icon: "warning" | "info" | "error" | "success"): void {

    }

    hide() {
        Swal.close()
    }

}
