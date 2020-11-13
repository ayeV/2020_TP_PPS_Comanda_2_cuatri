import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActionSheetController, ToastController } from '@ionic/angular';
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
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { ListaEsperaService } from '../servicios/lista-espera.service';
import { MesaService } from '../servicios/mesa.service';
import { FCM } from '@capacitor-community/fcm';

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
  public estaEnLista;
  public estadoLista;
  public mesa;
  public pedido = null;
  constructor(
    private authService: AuthService,
    private router: Router,
    private menuService: MenuService,
    private loaderService: LoaderService,
    private usuarioService: UsuarioService,
    private barcodeScanner: BarcodeScanner,
    public fcmService: FcmService,
    public toastController: ToastController,
    public pedidosService: PedidosService,
    private listaEsperaService: ListaEsperaService,
    public actionSheetController: ActionSheetController,
    private mesaService: MesaService) { }

  async presentToast(message) {
    const toast = await this.toastController.create({
      message: message,
      duration: 8000
    });
    toast.present();
  }

  ngOnInit() {
    this.info = this.authService.infoUsuario();
    this.getPedido();
    if (this.info.perfil == 'cliente') {
      this.listaEsperaService.obtenerPersonaEnLista(this.authService.userData.uid).subscribe((response) => {
        if (response.data()) {
          this.estaEnLista = true;
          this.estadoLista = response.data().estado;
          if (this.estadoLista == 'conMesa') {
            this.mesa = response.data().mesa;
            this.mesaService.idMesa = response.data().mesa;
          }
        } else {
          this.estaEnLista = false;
        }
      })
    }
    PushNotifications.requestPermission().then(result => {
      if (result.granted) {
        PushNotifications.register().then(response => {
          if (this.info.perfil == 'supervisor') {
            FCMPlugin.subscribeTo({ topic: 'registro' });
          }
          if (this.info.perfil == 'empleado' && this.info.tipo == 'mozo') {
            FCMPlugin.subscribeTo({ topic: 'consulta' });
          }
          if (this.info.perfil == 'empleado' && this.info.tipo == 'metre') {
            FCMPlugin.subscribeTo({ topic: 'listaEspera' });
          }
          if (this.info.perfil == 'empleado' && this.info.tipo == 'cocinero') {
            FCMPlugin.subscribeTo({ topic: 'cocina' });
          }
          if (this.info.perfil == 'empleado' && this.info.tipo == 'bartender') {
            FCMPlugin.subscribeTo({ topic: 'bar' });
          }
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
      FCMPlugin.unsubscribeFrom({ topic: 'registro' });
      FCMPlugin.unsubscribeFrom({ topic: 'consulta' });
      FCMPlugin.unsubscribeFrom({ topic: 'listaEspera' });
      FCMPlugin.unsubscribeFrom({ topic: 'cocina' });
      FCMPlugin.unsubscribeFrom({ topic: 'bar' });
      this.router.navigate(['home']);
    });
  }

  scanMesa() {
    this.barcodeScanner.scan({ formats: "TEXT", resultDisplayDuration: 0 }).then(barcodeData => {
      console.log('Barcode data', barcodeData['text']);
      let codigo = JSON.parse(barcodeData['text']);
      console.log(codigo);
      if (codigo && codigo.tipo && codigo.tipo == 'idMesa' && codigo.datos && codigo.datos.id) {
        let idMesa = codigo.datos.id;
        this.mesaService.obtenerMesa(idMesa).subscribe((response) => {
          if (response.data()) {
            if (response.data().estado == 'ocupada') {
              if (response.data().cliente == this.authService.userData.uid && this.pedido != null) {
                if (this.pedido[0].estado == 'recibido') {
                  this.presentActionSheePedirCuenta();
                }
                else{
                  this.presentActionSheetAccionesMesa(idMesa);
                }
              } else {
                this.presentToast('La mesa se encuentra ocupada');
              }
            }
            else {
              if (this.estadoLista == 'conMesa') {
                this.presentToast('No puede solicitar otra mesa.')
              }
              else {
                this.presentActionSheetSolicitarMesa(idMesa);
              }
            }
            this.mesa = response.data();
          }
        })
      }
      else {
        this.presentToast("Código incorrecto. Por favor lea un código QR de una mesa");
      }

    }).catch(err => {
      this.presentToast("Hubo un error");
    });
  }

  async presentActionSheetAccionesMesa(mesa) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Acciones',
      buttons: [{
        text: 'Ver estado del pedido',
        handler: () => {
          this.presentToast("Estado del pedido: " + this.pedido[0].estado);
        }
      }]
    })
    await actionSheet.present();
  }

  async presentActionSheePedirCuenta() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Acciones',
      buttons: [{
        text: 'Solicitar cuenta',
        handler: () => {
          this.router.navigate(['/pagar-pedido']);
        }},
        {
          text: 'Ver estado del pedido',
          handler: () => {
            this.presentToast("Estado del pedido: " + this.pedido[0].estado);
          }
        }
      ]
    })
    await actionSheet.present();
  }

  async presentActionSheetSolicitarMesa(mesa) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Acciones',
      buttons: [{
        text: 'Tomar Mesa',
        handler: () => {
          this.loaderService.showLoader();
          this.listaEsperaService.pasarAConMesa(this.authService.userData.uid, mesa).then((response) => {
            this.mesaService.tomarMesa(mesa, this.authService.userData.uid).then((response) => {
              this.mesa = mesa;
              this.estadoLista = 'conMesa'
              this.loaderService.hideLoader();
            });
          })
        }
      }]
    })
    await actionSheet.present();
  }

  scanEspera() {
    this.barcodeScanner.scan({ formats: "TEXT", resultDisplayDuration: 0 }).then(barcodeData => {
      console.log('Barcode data', barcodeData);
      let codigo = JSON.parse(barcodeData['text']);
      if (codigo && codigo.tipo && codigo.tipo == 'listaEspera') {
        this.listaEsperaService.agregarALista(this.authService.userData.uid).then((response) => {
          this.fcmService.sendNotificationWaitList().subscribe(()=>{
            
          });
          this.presentToast("Agregado a la lista de espera. Por favor espere las indicaciones.");
          this.estaEnLista = true;
          this.estadoLista = 'espera';
        })
      }
      else {
        this.presentToast("Código incorrecto. Por favor lea un código QR de lista de espera");
      }

    }).catch(err => {
      console.log('Error', err);
    });
  }

  getPedido() {
    this.loaderService.showLoader();
    let pedidos = []
    this.pedidosService.getPedidos().subscribe(x => {
      x.forEach(item => {
        pedidos.push({
          mesa: item.data().mesa,
          estado: item.data().estado,
          id: item.id,
          comidas: item.data().comidas,
          bebidas: item.data().bebidas,
          cliente: item.data().cliente,
          importeTotal: item.data().importeTotal
        });
      });
      this.pedido = pedidos.filter((p) => {
        return p.cliente.uid == this.authService.userData.uid;
      });
      console.log(this.pedido);
      this.loaderService.hideLoader();
    });

  }

  confirmarRecepcion() {
    if (this.pedido[0] != null) {
      this.pedido[0].estado = 'recibido';
      this.pedidosService.updateEstado(this.pedido[0].id, this.pedido[0].estado).then((x) => {
        this.loaderService.hideLoader();
        this.presentToast("Pedido recibido correctamente.");
      }).catch((e) => {
        this.loaderService.hideLoader();
        this.presentToast("Ha ocurrido un error, intente nuevamente mas tarde.");
      });
    }
  }


}
