import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { ModalPedidoPage } from '../modal-pedido/modal-pedido.page';
import { AuthService } from '../servicios/auth.service';
import { FcmService } from '../servicios/fcm.service';
import { LoaderService } from '../servicios/loader.service';
import { PedidosService } from '../servicios/pedidos.service';
import { UsuarioService } from '../servicios/usuario.service';

@Component({
  selector: 'app-preparar-pedido',
  templateUrl: './preparar-pedido.page.html',
  styleUrls: ['./preparar-pedido.page.scss'],
})
export class PrepararPedidoPage implements OnInit {

  public pedidos = [];

  constructor(
    private authService: AuthService,
    private loaderService: LoaderService,
    private toastController: ToastController,
    private pedidosService: PedidosService,
    private modalController: ModalController,
    private fcmService: FcmService
  ) { }

  ngOnInit() {
    this.getPedidos();
  }

  getPedidos() {
    this.loaderService.showLoader();
    let pedidos = [];
    this.pedidosService.getPedidos().subscribe(x => {
      x.forEach(item => {
        switch (this.authService.infoUsuario().tipo) {
          case 'bartender':
            if(item.data().bebidas.platos.length>0){
              pedidos.push({
                mesa: item.data().mesa,
                estado: item.data().estado,
                id: item.id,
                bebidas:item.data().bebidas,
                cliente:item.data().cliente,
                importeTotal:item.data().importeTotal
              });
            }
            break;
          case 'cocinero':
            if(item.data().comidas.platos.length>0){
              console.log(item.data().estado);
              pedidos.push({
                mesa: item.data().mesa,
                estado: item.data().estado,
                id: item.id,
                comidas:item.data().comidas,
                cliente:item.data().cliente,
                importeTotal:item.data().importeTotal
              });
            }
            break;
          default:
            break;
        }
      });
      this.pedidos = pedidos;
      this.loaderService.hideLoader();
    });
  }

  async presentModal(pedido) {
    console.log(pedido);
    const modal = await this.modalController.create({
      component: ModalPedidoPage,
      componentProps:{
        'comidas':pedido.comidas? pedido.comidas: null,
        'bebidas':pedido.bebidas? pedido.bebidas: null
      }
    });
    return await modal.present();
  }

  async presentToast(messageText: string) {
    const toast = await this.toastController.create({
      message: messageText,
      duration: 2000
    });
    toast.present();
  }

  confirmarPedido(pedido)
  {
    this.loaderService.showLoader();
    pedido.estado = 'listo';
    switch (this.authService.infoUsuario().tipo) {
      case 'bartender':
        this.pedidosService.updateEstadoBebidas(pedido.id, pedido.estado).then(()=>{
          let listaModificada = [];
          for (let i = 0; i < this.pedidos.length; i++) {
            if (pedido.id == this.pedidos[i].id) {
              listaModificada.push(pedido);
            }
            else {
              listaModificada.push(this.pedidos[i]);
            }
          }
          this.pedidos = listaModificada;
          this.validarEstadoPedido(pedido.id);
          this.presentToast("Pedido confirmado correctamente.");
        })
        break;
      case 'cocinero':
        this.pedidosService.updateEstadoComida(pedido.id, pedido.estado).then(()=>{
          let listaModificada = [];
          for (let i = 0; i < this.pedidos.length; i++) {
            if (pedido.id == this.pedidos[i].id) {
              listaModificada.push(pedido);
            }
            else {
              listaModificada.push(this.pedidos[i]);
            }
          }
          this.pedidos = listaModificada;
          this.validarEstadoPedido(pedido.id);
          this.presentToast("Pedido confirmado correctamente.");
        })
        break;
      default:
        break;
    }
  }

  validarEstadoPedido(id){
    this.pedidosService.getPedido(id).subscribe((resultado)=>{
      let pedido = resultado.data();
      let estaListo = false;
      if(pedido.comidas.platos.length>0 && pedido.comidas.estado == 'listo' && pedido.bebidas.platos.length>0 && pedido.bebidas.estado == 'listo'){
        estaListo = true;
      }else if(pedido.comidas.platos.length >0 && pedido.comidas.estado == 'listo' && pedido.bebidas.platos.length == 0){
        estaListo = true;
      }else if(pedido.comidas.platos.length == 0 && pedido.bebidas.platos.length > 0 && pedido.bebidas.estado == 'listo'){
        estaListo = true;
      }
      if(estaListo){
        this.pedidosService.updateEstado(id, 'listo').then(()=>{
          this.fcmService.sendNotificationPedidoListo(pedido.mesa.nombre);
          this.loaderService.hideLoader();
        });
      }else{
        this.loaderService.hideLoader();
      }
    })
  }

}
