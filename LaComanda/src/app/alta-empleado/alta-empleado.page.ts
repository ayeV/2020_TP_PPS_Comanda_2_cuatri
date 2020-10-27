import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { Usuario } from '../clases/usuario';
import { AuthService } from '../servicios/auth.service';
import { LoaderService } from '../servicios/loader.service';
import { UsuarioService } from '../servicios/usuario.service';

@Component({
  selector: 'app-alta-empleado',
  templateUrl: './alta-empleado.page.html',
  styleUrls: ['./alta-empleado.page.scss'],
})
export class AltaEmpleadoPage implements OnInit {

  private altaEmpleado: FormGroup;
  public loggedUser: any;
  public estaCargando = true;
  public foto:string;
  constructor(public toastController: ToastController, private usuarioService: UsuarioService,
    private loaderService: LoaderService, private formBuilder: FormBuilder, private authService: AuthService) {
    this.altaEmpleado = this.formBuilder.group({
      apellido: ['', [Validators.required, Validators.maxLength(15)]],
      nombre: ['', [Validators.required, Validators.maxLength(15)]],
      cuil: ['', [Validators.required, Validators.maxLength(10)]],
      dni: ['', [Validators.required, Validators.maxLength(8)]],
      clave: ['', [Validators.required, Validators.maxLength(8)]],
      email: ['', [Validators.required, Validators.email]],
      tipo: ['', [Validators.required]]

    });
  }

  ngOnInit() {
    this.getLoggedUser();
  }


  async presentToast(messageText: string) {
    const toast = await this.toastController.create({
      message: messageText,
      duration: 2000
    });
    toast.present();
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


  guardar() {
    this.loaderService.showLoader();

    this.authService.RegisterUser(this.altaEmpleado.value.email, this.altaEmpleado.value.clave).then((res) => {
      let usuario = new Usuario(res.user.uid, this.altaEmpleado.value.nombre, this.altaEmpleado.value.apellido, this.foto, this.altaEmpleado.value.dni, this.altaEmpleado.value.cuil, 'empleado', 'aceptado', this.altaEmpleado.value.tipo);
      this.usuarioService.postUsuario(usuario).then(() => {
        this.loaderService.hideLoader();
        this.presentToast("Empleado registrado correctamente.");
      }).catch(() => {
        this.presentToast("Ha ocurrido un error, vuelve a intentarlo mas tarde.");

      });
    });



  }
}
