import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ActionSheetController, ToastController } from '@ionic/angular';
import { AuthService } from '../servicios/auth.service';
import { ErrorService } from '../servicios/error.service';
import { LoaderService } from '../servicios/loader.service';
import { UsuarioService } from '../servicios/usuario.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  private login: FormGroup;

  constructor(
    public authService: AuthService,
    public router: Router,
    public toastController: ToastController,
    public errorController: ErrorService,
    private formBuilder: FormBuilder,
    public actionSheetController: ActionSheetController,
    private usuarioService: UsuarioService,
    private loaderService: LoaderService) {
      this.login = this.formBuilder.group({
        correo: ['', [Validators.required, Validators.email]],
        clave: ['', [Validators.required, Validators.minLength(6)]]
      });
    }
  ngOnInit(): void {
  }

  logForm(){
    if(this.login.value.correo!=null && this.login.value.clave!=null){
      this.loaderService.showLoader();
      this.authService.login(this.login.value.correo, this.login.value.clave)
        .then((res) => {
          this.usuarioService.getUsuario(this.authService.userData.uid).subscribe((response)=>{
            this.authService.setUserInfo(response.data());
            this.loaderService.hideLoader();
            this.router.navigate(['principal']);  
          })
        })
        .catch((error) => {
          this.loaderService.hideLoader();
          this.presentToast(this.errorController.translate(error.code))
        });
    }
  }

  async presentToast(messageText: string) {
    const toast = await this.toastController.create({
      message: messageText,
      duration: 2000
    });
    toast.present();
  }

  llenarUsuario(usuario){
    switch (usuario) {
      case 'admin':
        this.login.setValue({
          correo: "ayelenvaldez07@gmail.com",
          clave: "123456"
        });
        break;
      case 'dueño':
        this.login.setValue({
          correo: "duenio@mail.com",
          clave: "123456"
        });
        break;
      case 'supervisor':
        this.login.setValue({
          correo: "supervisor@mail.com",
          clave: "123456"
        });
        break;
      case 'cliente':
        this.login.setValue({
          correo: "cliente@mail.com",
          clave: "123456"
        });
        break;
      case 'empleado':
        this.login.setValue({
          correo: "empleado@mail.com",
          clave: "123456"
        });
        break;
      default:
        break;
    }
  }

}
