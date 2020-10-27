import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { ToastController } from '@ionic/angular';
import { Usuario } from 'src/app/clases/usuario';
import { CuilValidator } from '../clases/cuil-validator';
import { AuthService } from '../servicios/auth.service';
import { LoaderService } from '../servicios/loader.service';
import { UsuarioService } from '../servicios/usuario.service';
import { Plugins, CameraResultType } from '@capacitor/core';
import { Router } from '@angular/router';
const { Camera } = Plugins;

@Component({
  selector: 'app-alta-supervisor',
  templateUrl: './alta-supervisor.page.html',
  styleUrls: ['./alta-supervisor.page.scss'],
})
export class AltaSupervisorPage implements OnInit {

  public foto: string;
  private altaSupervisor: FormGroup;
  public loggedUser: any;
  public estaCargando = true;
  public data;

  constructor(
    public toastController: ToastController,
    private usuarioService: UsuarioService,
    private loaderService: LoaderService,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private barcodeScanner: BarcodeScanner,
    private router: Router) {
    this.altaSupervisor = this.formBuilder.group({
      apellido: ['', [Validators.required]],
      nombre: ['', [Validators.required]],
      dni: ['', [Validators.required]],
      correo: ['', [Validators.required, Validators.email]],
      clave: ['', [Validators.required, Validators.minLength(6)]],
      cuil: ['', [Validators.required, CuilValidator.cuilValido]]
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

  get f(){
    return this.altaSupervisor.controls;
  }

  async presentToast(messageText: string) {
    const toast = await this.toastController.create({
      message: messageText,
      duration: 2000
    });
    toast.present();
  }

  scan(){
    this.data = null;
    this.barcodeScanner.scan({formats: "PDF_417"}).then(barcodeData => {
      console.log('Barcode data', barcodeData);
      let string = barcodeData['text'].split("@");
      this.altaSupervisor.setValue({
        apellido: string[2],
        nombre: string[1],
        dni: string[4],
        correo: this.altaSupervisor.value.correo,
        clave: this.altaSupervisor.value.clave,
        cuil: this.altaSupervisor.value.cuil
      })
      this.data = barcodeData.toString();
    }).catch(err => {
      console.log('Error', err);
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

    this.authService.RegisterUser(this.altaSupervisor.value.correo, this.altaSupervisor.value.clave).then((response)=>{
      let usuario = new Usuario(response.user.uid, this.altaSupervisor.value.nombre, this.altaSupervisor.value.apellido, null, this.altaSupervisor.value.dni, this.altaSupervisor.value.cuil, 'supervisor', 'aceptado');
      this.usuarioService.postUsuario(usuario).then(() => {
        if(this.foto){
          this.usuarioService.uploadFile(this.foto).on('state_changed', (snapshot)=>{

          },
          (error)=>{

          },
          ()=>{
            this.usuarioService.uploadTask.snapshot.ref.getDownloadURL().then((downloadUrl)=>{
              this.usuarioService.updateUserPic(usuario.uid, downloadUrl).then(()=>{
                this.loaderService.hideLoader();
                this.router.navigate(['principal']);
                this.presentToast("Usuario dado de alta correctamente.");
              })
            })
          })
        }
        else{
          this.loaderService.hideLoader();
          this.router.navigate(['principal']);
          this.presentToast("Usuario dado de alta correctamente.");
        }
      }).catch(() => {
        this.presentToast("Ha ocurrido un error, vuelve a intentarlo mas tarde.");
  
      })
    })
  }

}
