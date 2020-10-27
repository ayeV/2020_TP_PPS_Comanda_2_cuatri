import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { Usuario } from 'src/app/clases/usuario';
import { AuthService } from '../servicios/auth.service';
import { LoaderService } from '../servicios/loader.service';
import { UsuarioService } from '../servicios/usuario.service';

@Component({
  selector: 'app-alta-supervisor',
  templateUrl: './alta-supervisor.page.html',
  styleUrls: ['./alta-supervisor.page.scss'],
})
export class AltaSupervisorPage implements OnInit {

  public apellido: string;
  public nombre: string;
  public dni: string;
  public cuil: string;
  public foto: string;
  private altaSupervisor: FormGroup;
  public loggedUser: any;
  public estaCargando = true;
  constructor(public toastController: ToastController, private usuarioService: UsuarioService,
    private loaderService: LoaderService, private formBuilder: FormBuilder, private authService: AuthService) {
    this.altaSupervisor = this.formBuilder.group({
      apellido: ['', [Validators.required, Validators.email]],
      nombre: ['', [Validators.required]],
      cuil: ['', [Validators.required]],
      dni: ['', [Validators.required]],

    });
  }

  ngOnInit() {
    this.getLoggedUser();
  }

  getLoggedUser() {
    this.loaderService.showLoader();
    let user;
    this.usuarioService.getUsuario(this.authService.userData.uid).subscribe((res) => {
      user = res.data();
      this.estaCargando = false;
      this.loggedUser = user;
      this.loggedUser['uid'] = this.authService.userData.uid;
      this.loaderService.hideLoader();
    });
  }

  async presentToast(messageText: string) {
    const toast = await this.toastController.create({
      message: messageText,
      duration: 2000
    });
    toast.present();
  }

  guardar() {
    this.loaderService.showLoader();

    let usuario = new Usuario(this.nombre, this.apellido, this.foto, this.dni, this.cuil, 'supervisor', 'aceptado');

    this.usuarioService.postUsuario(this.loggedUser.uid, usuario).then(() => {
      this.loaderService.hideLoader();
      this.presentToast("Usuario dado de alta correctamente.");
    }).catch(() => {
      this.presentToast("Ha ocurrido un error, vuelve a intentarlo mas tarde.");

    })

  }

}
