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
import { FcmService } from '../servicios/fcm.service';
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
    private router: Router,
    private FCMService: FcmService) {
    this.altaCliente = this.formBuilder.group({
      apellido: ['', [Validators.required, Validators.maxLength(50)]],
      nombre: ['', [Validators.required, Validators.maxLength(50)]],
      dni: ['', [Validators.required, Validators.maxLength(10)]],
      clave: ['', [Validators.required, Validators.minLength(6)]],
      email: ['', [Validators.required, Validators.email]]
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
    let user;
    if(this.authService.userData &&  this.authService.userData.uid){
      this.loaderService.showLoader();
      this.usuarioService.getUsuario(this.authService.userData.uid).subscribe((res) => {
        user = res.data();
        this.estaCargando = false;
        this.loggedUser = user;
        this.loggedUser['uid'] = this.authService.userData.uid;
        this.loaderService.hideLoader();
      });
    }
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
      let usuario = new Usuario(res.user.uid, this.altaCliente.value.nombre, this.altaCliente.value.apellido, this.foto, this.altaCliente.value.dni, null, 'cliente', 'pendiente', null,res.user.email);
      this.usuarioService.postCustomer(usuario, this.esAnonimo).then(() => {
        if (this.foto) {
          this.usuarioService.uploadFile(this.foto).on('state_changed', (snapshot) => {

          },
            (error) => {

            },
            () => {
              this.usuarioService.uploadTask.snapshot.ref.getDownloadURL().then((downloadUrl) => {
                this.usuarioService.updateUserPic(usuario.uid, downloadUrl).then(() => {
                  this.FCMService.sendNotificationNewCustomer().subscribe((response)=>{
                    this.loaderService.hideLoader();
                    if(this.loggedUser){
                      this.router.navigate(['principal']);
                    }
                    else{
                      this.router.navigate(['login']);
                    }
                    this.presentToast("Usuario dado de alta correctamente.");
                  });
                })
              })
            })
        }
        else {
          this.FCMService.sendNotificationNewCustomer().subscribe((response)=>{
            this.loaderService.hideLoader();
            if(this.loggedUser){
              this.router.navigate(['principal']);
            }
            else{
              this.router.navigate(['login']);
            }
            this.presentToast("Usuario dado de alta correctamente.");
          })
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
        email: this.altaCliente.value.email,
        clave: this.altaCliente.value.clave
      });

    }).catch(err => {
      console.log('Error', err);
    });
  }

  anonimoCheck(){
    if(this.esAnonimo){
      this.altaCliente.setValue({
        apellido: 'completo',
        nombre: this.altaCliente.value.nombre,
        dni: 'completo',
        clave: this.altaCliente.value.clave,
        email: this.altaCliente.value.email
      })
    }
    else{
      this.altaCliente.setValue({
        apellido: '',
        nombre: this.altaCliente.value.nombre,
        dni: '',
        clave: this.altaCliente.value.clave,
        email: this.altaCliente.value.email
      })
    }
  }

}
