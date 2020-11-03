import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { AuthService } from '../servicios/auth.service';
import { FcmService } from '../servicios/fcm.service';
import { LoaderService } from '../servicios/loader.service';
import { MesaService } from '../servicios/mesa.service';

@Component({
  selector: 'app-consulta',
  templateUrl: './consulta.page.html',
  styleUrls: ['./consulta.page.scss'],
})
export class ConsultaPage implements OnInit {

  private altaConsulta: FormGroup;
  private mesa:any;
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    public toastController: ToastController,
    private loaderService: LoaderService,
    public mesaService:MesaService,
    private FCMService: FcmService,
    private router: Router) {
    this.altaConsulta = this.formBuilder.group({
      consulta: ['', [Validators.required]],
    });
  }

  ngOnInit() {
    this.getMesa();
  }

  async presentToast(messageText: string) {
    const toast = await this.toastController.create({
      message: messageText,
      duration: 2000
    });
    toast.present();
  }

  enviar()
  {
    this.loaderService.showLoader();
    this.FCMService.sendNotificationConsultas(this.altaConsulta.value.consulta,this.mesa[0].nombre).subscribe((x)=>{
      this.loaderService.hideLoader();
      this.presentToast("Su consulta ha sido enviada.");
      this.router.navigate(['principal']);
    });
  }

  getMesa()
  {
    this.loaderService.showLoader();
    let mesas = [];
    this.mesaService.getMesas().subscribe(x => {
      x.forEach(item => {
        mesas.push({
         nombre:item.data().nombre,
         id:item.id,
         cliente:item.data().cliente,
         estado:item.data().estado
        });
      });
      this.mesa = mesas.filter((x)=>{
        return (x.cliente && x.cliente == this.authService.userData.uid);
      });
      this.loaderService.hideLoader();
    });
  }

}
