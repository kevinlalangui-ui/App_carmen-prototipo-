import { Component, OnInit, signal } from '@angular/core';
import{AddMember} from './components/add-member/add-member';
import { DeleteMember } from './components/delete-member/delete-member';
import{SociosService} from '../../core/services/socios/socios.service';
import { NgClass } from '@angular/common';
import{AlertasService} from '../../core/utils/alertas.service';


interface SociosInterface {
  id: string;
  informacionPersonalModel: {
    identificacion: string;
    nombres: string;
    apellidos: string;
    correo: string;
    telefono: string;
    contrasena: string | null;
  };
  estado_Socio: string;
  tipo_socio: string;
  ultimo_pago: string | null;
  fecha_vencimiento: string | null;
  historial_pagos: string[];
  actividades: Record<string, any>;
}

@Component({
  selector: 'app-main-layout',
  imports: [AddMember, DeleteMember,NgClass],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss',
})
export class MainLayout implements OnInit {
  socios = signal<SociosInterface[]>([])

  openAddMember = signal<boolean>(false);
  showAddMember() {
    this.openAddMember.update((state) => !state);
  }

  openDeleteMember = signal<boolean>(false);
  showDeleteMember() {
    this.openDeleteMember.update((state) => !state);
  }
  constructor(
    private SociosService : SociosService,
    private alertasService: AlertasService,

  ) {

  }
  ngOnInit() {
    this.alertasService.showLoader()
    setTimeout(() => {
      this.SociosService.getSocios().subscribe({
        next: response => {
          this.socios.set(response.data);
        },
        error: error => {
          console.log(error);

        },
        complete: () => {
          this.alertasService.hide()
        }
      })

    }, 1500)
  }

  // toggleAphabetically=signal<boolean>(false);
  // sortNamesAlphabetically(){
  //
  // }

  // }

}
