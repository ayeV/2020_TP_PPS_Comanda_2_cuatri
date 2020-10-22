import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ActionSheetController, ToastController } from '@ionic/angular';
import { AuthService } from '../servicios/auth.service';
import { ErrorService } from '../servicios/error.service';

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
    public actionSheetController: ActionSheetController) {
      this.login = this.formBuilder.group({
        correo: ['', [Validators.required, Validators.email]],
        clave: ['', [Validators.required, Validators.minLength(6)]]
      });
    }
  ngOnInit(): void {
  }

  logForm(){
    if(this.login.value.correo!=null && this.login.value.clave!=null){
      console.log(this.login.value)
      this.authService.SignIn(this.login.value.correo, this.login.value.clave)
        .then((res) => {
          this.router.navigate(['principal']);          
        })
        .catch((error) => {
          console.log(error);
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
      case 'invitado':
        this.login.setValue({
          correo: "invitado@invitado.com",
          clave: "222222"
        });
        break;
      case 'usuario':
        this.login.setValue({
          correo: "usuario@usuario.com",
          clave: "333333"
        });
        break;
      case 'anonimo':
        this.login.setValue({
          correo: "anonimo@anonimo.com",
          clave: "444444"
        });
        break;
      case 'tester':
        this.login.setValue({
          correo: "tester@tester.com",
          clave: "555555"
        });
        break;
      default:
        break;
    }
  }

}
