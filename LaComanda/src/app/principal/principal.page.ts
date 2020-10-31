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
  public cantidad = 0;
  public platosPedidos = [];
  public importeTotal = 0;
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

  ngOnInit() {
    this.info = this.authService.infoUsuario();
    PushNotifications.requestPermission().then(result => {
      if (result.granted) {
        PushNotifications.register().then(response => {
          FCMPlugin.subscribeTo({ topic: 'registro' });
        });
      }
    });

    PushNotifications.addListener('registration', (token: PushNotificationToken) => {
      this.fcmService.guardarToken(token.value).then(() => {
      })
    })

    PushNotifications.addListener('registrationError',
      (error: any) => {
      })

    PushNotifications.addListener('pushNotificationReceived', (notification: PushNotification) => {
      this.presentToast(JSON.stringify(notification.body));
    })

    PushNotifications.addListener('pushNotificationActionPerformed', (notification: PushNotificationActionPerformed) => {
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


}
