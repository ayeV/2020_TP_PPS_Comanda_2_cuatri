import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Camera, CameraResultType } from '@capacitor/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { ToastController } from '@ionic/angular';
import { CuilValidator } from '../clases/cuil-validator';
import { DniQR } from '../clases/dni-qr';
import { Usuario } from '../clases/usuario';
import { AuthService } from '../servicios/auth.service';
import { LoaderService } from '../servicios/loader.service';
import { UsuarioService } from '../servicios/usuario.service';

@Component({
  selector: 'app-alta-cliente',
  templateUrl: './alta-cliente.page.html',
  styleUrls: ['./alta-cliente.page.scss'],
})
export class AltaClientePage implements OnInit {

  public esAnonimo = false;
  private altaCliente: FormGroup;
  public loggedUser: any;
  public estaCargando = true;
  public foto: string;
  constructor( public toastController: ToastController,
    private usuarioService: UsuarioService,
    private loaderService: LoaderService,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private barcodeScanner: BarcodeScanner,
    private router: Router) {
    this.altaCliente = this.formBuilder.group({
      apellido: ['', [Validators.required, Validators.maxLength(15)]],
      nombre: ['', [Validators.required, Validators.maxLength(15)]],
      cuil: ['', [Validators.required, CuilValidator.cuilValido]],
      dni: ['', [Validators.required, Validators.maxLength(8)]],
      clave: ['', [Validators.required, Validators.minLength(6)]],
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

  async takePicture() {
    try {
      const profilePicture = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
      });
      this.foto = profilePicture.dataUrl;

    } catch (error) {
      console.error(error);
    }
  }



  guardar() {
    this.loaderService.showLoader();

    this.authService.RegisterUser(this.altaCliente.value.email, this.altaCliente.value.clave).then((res) => {
      let usuario = new Usuario(res.user.uid, this.altaCliente.value.nombre, this.altaCliente.value.apellido, this.foto, this.altaCliente.value.dni, this.altaCliente.value.cuil, 'cliente', 'pendiente', this.altaCliente.value.tipo);
      this.usuarioService.postUsuario(usuario).then(() => {
        if (this.foto) {
          this.usuarioService.uploadFile(this.foto).on('state_changed', (snapshot) => {

          },
            (error) => {

            },
            () => {
              this.usuarioService.uploadTask.snapshot.ref.getDownloadURL().then((downloadUrl) => {
                this.usuarioService.updateUserPic(usuario.uid, downloadUrl).then(() => {
                  this.loaderService.hideLoader();
                  this.router.navigate(['principal']);
                  this.presentToast("Usuario dado de alta correctamente.");
                })
              })
            })
        }
        else {
          this.loaderService.hideLoader();
          this.router.navigate(['principal']);
          this.presentToast("Usuario dado de alta correctamente.");
        }
      }).catch(() => {
        this.loaderService.hideLoader();
        this.presentToast("Ha ocurrido un error, vuelve a intentarlo mas tarde.");

      });
    });

  }

  get f() {
    return this.altaCliente.controls;
  }



  scan() {
    this.barcodeScanner.scan({ formats: "PDF_417" }).then(barcodeData => {
      console.log('Barcode data', barcodeData);
      let info = DniQR.decodeQR(barcodeData['text']);
      this.altaCliente.setValue({
        apellido: info.apellido,
        nombre: info.nombre,
        dni: info.dni,
        correo: this.altaCliente.value.email,
        clave: this.altaCliente.value.clave,
        cuil: this.altaCliente.value.cuil,
        tipo: this.altaCliente.value.tipo,
      });

    }).catch(err => {
      console.log('Error', err);
    });
  }

}
