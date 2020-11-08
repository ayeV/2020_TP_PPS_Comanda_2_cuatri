import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { ModalPedidoPage } from '../modal-pedido/modal-pedido.page';
import { FcmService } from '../servicios/fcm.service';
import { ListaEsperaService } from '../servicios/lista-espera.service';
import { LoaderService } from '../servicios/loader.service';
import { MesaService } from '../servicios/mesa.service';
import { PedidosService } from '../servicios/pedidos.service';
import { UsuarioService } from '../servicios/usuario.service';

@Component({
  selector: 'app-admin-pedidos-mozo',
  templateUrl: './admin-pedidos-mozo.page.html',
  styleUrls: ['./admin-pedidos-mozo.page.scss'],
})
export class AdminPedidosMozoPage implements OnInit {

  public pedidosPendientes = [];
  public pedidosPagados=[];
  public pedidosListos = [];
  constructor( private UsuarioService: UsuarioService,
    private loaderService: LoaderService,
    public toastController: ToastController,
    private pedidosService:PedidosService,
    public modalController: ModalController,
    private fcmService: FcmService,
    public mesaService:MesaService,
    public listaEsperaService:ListaEsperaService) { }

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
      this.pedidosPendientes = pedidos.filter((p)=>{
        return p.estado == 'pendiente';
      });
      this.pedidosPagados = pedidos.filter((p)=>{
       return p.estado == 'pagado';
      });
      this.pedidosListos = pedidos.filter((p)=>{
        return p.estado == 'listo';
       });
      this.loaderService.hideLoader();
    });
  }

  confirmarPedido(pedido)
  {
    this.loaderService.showLoader();
    pedido.estado = 'confirmado';
    this.pedidosService.updateEstado(pedido.id,pedido.estado).then((x) => {
      let listaModificada = [];
      for (let i = 0; i < this.pedidosPendientes.length; i++) {
        if (pedido.id == this.pedidosPendientes[i].id) {
          listaModificada.push(pedido);
        }
        else {
          listaModificada.push(this.pedidosPendientes[i]);
        }
      }
      this.pedidosPendientes = listaModificada;
      if(pedido.bebidas.platos.length>0){
        this.fcmService.sendNotificationBar(pedido.mesa.nombre).subscribe(()=>{

        });;
      }
      if(pedido.comidas.platos.length>0){
        this.fcmService.sendNotificationCocina(pedido.mesa.nombre).subscribe(()=>{
          
        });
      }
      this.loaderService.hideLoader();
      this.presentToast("Pedido confirmado correctamente.");
    }).catch((e) => {
      this.loaderService.hideLoader();
      this.presentToast("Ha ocurrido un error, intente nuevamente mas tarde.");
    });
  }

  
  cerrarPedido(pedido)
  {
    this.loaderService.showLoader();
    pedido.estado = 'cerrado';
    this.pedidosService.updateEstado(pedido.id,pedido.estado).then((x) => {
      let listaModificada = [];
      for (let i = 0; i < this.pedidosPagados.length; i++) {
        if (pedido.id == this.pedidosPagados[i].id) {
          listaModificada.push(pedido);
        }
        else {
          listaModificada.push(this.pedidosPagados[i]);
        }
        this.mesaService.liberarMesa(pedido.mesa.id).then((a)=>{
            this.listaEsperaService.borrarDeLista(pedido.cliente.uid).then((x)=>{
              this.pedidosPagados = listaModificada;
              this.loaderService.hideLoader();
              this.presentToast("Pedido cerrado correctamente.");
            });
        });
      }
    }).catch((e) => {
      this.loaderService.hideLoader();
      this.presentToast("Ha ocurrido un error, intente nuevamente mas tarde.");
    });
  }
}
