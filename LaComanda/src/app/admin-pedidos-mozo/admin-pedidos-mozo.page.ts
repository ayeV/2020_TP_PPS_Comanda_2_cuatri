import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { ModalPedidoPage } from '../modal-pedido/modal-pedido.page';
import { LoaderService } from '../servicios/loader.service';
import { PedidosService } from '../servicios/pedidos.service';
import { UsuarioService } from '../servicios/usuario.service';

@Component({
  selector: 'app-admin-pedidos-mozo',
  templateUrl: './admin-pedidos-mozo.page.html',
  styleUrls: ['./admin-pedidos-mozo.page.scss'],
})
export class AdminPedidosMozoPage implements OnInit {

  public pedidos = [];
  constructor( private UsuarioService: UsuarioService,
    private loaderService: LoaderService,
    public toastController: ToastController,
    private pedidosService:PedidosService,
    public modalController: ModalController) { }

  ngOnInit() {
    this.getPedidos();
  }

  async presentModal(pedido) {
    console.log(pedido);
    const modal = await this.modalController.create({
      component: ModalPedidoPage,
      componentProps:{
        'comidas':pedido.comidas,
        'bebidas':pedido.bebidas,
        'importeTotal':pedido.importeTotal
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

  
  getPedidos() {
    this.loaderService.showLoader();
    let pedidos = [];
    this.pedidosService.getPedidos().subscribe(x => {
      x.forEach(item => {
        pedidos.push({
          mesa: item.data().mesa,
          estado: item.data().estado,
          id: item.id,
          comidas: item.data().comidas,
          bebidas:item.data().bebidas,
          cliente:item.data().cliente,
          importeTotal:item.data().importeTotal
        });
      });
      this.pedidos = pedidos;
      this.loaderService.hideLoader();
    });
  }

  confirmarPedido(pedido)
  {
    this.loaderService.showLoader();
    pedido.estado = 'confirmado';
    this.pedidosService.updateEstado(pedido.id,pedido.estado).then((x) => {
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
      this.loaderService.hideLoader();
      this.presentToast("Pedido confirmado correctamente.");
    }).catch((e) => {
      this.loaderService.hideLoader();
      this.presentToast("Ha ocurrido un error, intente nuevamente mas tarde.");
    });
  }
}
