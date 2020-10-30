import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { AuthService } from '../servicios/auth.service';
import { LoaderService } from '../servicios/loader.service';
import { MenuService } from '../servicios/menu.service';
import { UsuarioService } from '../servicios/usuario.service';
import { FcmService } from '../servicios/fcm.service';
import {
  Plugins,
  PushNotification,
  PushNotificationToken,
  PushNotificationActionPerformed,
  Capacitor
} from '@capacitor/core';
import { PedidosService } from '../servicios/pedidos.service';

const { PushNotifications } = Plugins;
const { FCMPlugin } = Plugins;

@Component({
  selector: 'app-principal',
  templateUrl: './principal.page.html',
  styleUrls: ['./principal.page.scss'],
})
export class PrincipalPage implements OnInit {
  public info;
  public platos = [];
  public loggedUser: any;
  public cantidad= 0;
  public platosPedidos = [];
  constructor(
    private authService: AuthService,
    private router: Router,
    private menuService: MenuService,
    private loaderService: LoaderService,
    private usuarioService: UsuarioService,
    public fcmService: FcmService,
    public toastController: ToastController,
    public pedidosService: PedidosService) { }

  async presentToast(message) {
    const toast = await this.toastController.create({
      message: message,
      duration: 8000
    });
    toast.present();
  }

  prueba(){
    this.fcmService.sendNotification("mensaje de prueba");
  }

  ngOnInit() {
    this.info = this.authService.infoUsuario();
    this.getPlatos();
    PushNotifications.requestPermission().then(result => {
      if (result.granted) {
        PushNotifications.register().then(response=>{
          FCMPlugin.subscribeTo({topic: 'registro'});
        });
      }
    });

    PushNotifications.addListener('registration', (token: PushNotificationToken) => {
      alert('push notification token: ' + token.value);
      this.fcmService.guardarToken(token.value).then(() => {
        this.presentToast('token guardado')
      })
    })

    PushNotifications.addListener('registrationError',
      (error: any) => {
        alert('error: ' + JSON.stringify(error));
      })

    PushNotifications.addListener('pushNotificationReceived', (notification: PushNotification) => {
      this.presentToast(JSON.stringify(notification));
    })

    PushNotifications.addListener('pushNotificationActionPerformed', (notification: PushNotificationActionPerformed) => {
      alert('accion' + JSON.stringify(notification));
    })
  }

  irA(ruta) {
    this.router.navigate([ruta]);
  }

  salir() {
    this.authService.SignOut().then(() => {
      this.router.navigate(['home']);
    });
  }

  getPlatos() {
    this.loaderService.showLoader();
    let platos = [];
    this.menuService.getPlatos().subscribe(x => {
      x.forEach(item => {
        platos.push({
          nombre: item.data().nombre,
          descripcion: item.data().descripcion,
          importe: item.data().importe,
          fotos: item.data().fotos,
          id: item.id,
          tipo: item.data().tipo
        });
      });
      this.platos = platos;
      this.loaderService.hideLoader();
    });
  }

  agregar(plato)
  {
    this.cantidad++;
    this.platosPedidos.push(plato);
    
  }

  quitar(plato)
  {
    if(this.cantidad > 0)
    {
      this.cantidad --;

    }
  } 

}
