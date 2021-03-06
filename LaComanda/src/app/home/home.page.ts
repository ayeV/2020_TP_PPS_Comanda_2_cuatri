import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ActionSheetController, ToastController } from '@ionic/angular';
import { AuthService } from '../servicios/auth.service';
import { ErrorService } from '../servicios/error.service';
import { LoaderService } from '../servicios/loader.service';
import { SoundService } from '../servicios/sound.service';
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
    private loaderService: LoaderService,
    private soundService: SoundService) {
    this.login = this.formBuilder.group({
      correo: ['', [Validators.required, Validators.email]],
      clave: ['', [Validators.required, Validators.minLength(6)]]
    });
  }
  ngOnInit(): void {
  }

  ionViewWillEnter() {
    this.login.setValue({
      correo: '',
      clave: ''
    });
    this.soundService.preload('login', "assets/audio/login.wav");
  }

  ionViewWillLeave() {
    this.soundService.unload('login');
  }

  logForm() {
    if (this.login.value.correo != null && this.login.value.clave != null) {
      this.loaderService.showLoader();
      this.authService.login(this.login.value.correo, this.login.value.clave)
        .then((res) => {
          this.usuarioService.getUsuario(this.authService.userData.uid).subscribe((response) => {
            if (response.data().perfil == 'cliente' && response.data().estado != 'aceptado') {
              this.loaderService.hideLoader();
              this.presentToast("Debes ser aceptado por el supervisor para poder iniciar sesión.");
            }
            else {
              this.soundService.play('login');
              this.authService.setUserInfo(response.data());
              this.loaderService.hideLoader();
              this.router.navigate(['principal']);
            }
          });
        })
        .catch((error) => {
          this.loaderService.hideLoader();
          this.presentToast(error)
        });
    }
  }

  irARegistro() {
    this.router.navigate(['alta-cliente']);
  }

  async presentToast(messageText: string) {
    const toast = await this.toastController.create({
      message: messageText,
      duration: 2000
    });
    toast.present();
  }

  llenarUsuario(usuario) {
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
      case 'cocinero':
        this.login.setValue({
          correo: "cocinero1@gmail.com",
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
      case 'mozo':
        this.login.setValue({
          correo: "mozo1@gmail.com",
          clave: "123456"
        });
        break;
      case 'metre':
        this.login.setValue({
          correo: "metre@mail.com",
          clave: "123456"
        });
        break;
      case 'bartender':
        this.login.setValue({
          correo: "bartender@mail.com",
          clave: "123456"
        });
        break;
      default:
        break;
    }
  }

}
