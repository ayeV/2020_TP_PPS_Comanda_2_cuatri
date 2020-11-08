import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { Mesa } from '../clases/mesa';
import { AuthService } from '../servicios/auth.service';
import { LoaderService } from '../servicios/loader.service';
import { MesaService } from '../servicios/mesa.service';
import { PedidosService } from '../servicios/pedidos.service';

@Component({
  selector: 'app-confirmar-pedido',
  templateUrl: './confirmar-pedido.page.html',
  styleUrls: ['./confirmar-pedido.page.scss'],
})
export class ConfirmarPedidoPage implements OnInit {

  public pedido = [];
  public importeTotal = 0;
  public usuario;
  public mesa:Mesa;
  constructor(private pedidosService: PedidosService,
    private authService: AuthService,
    public router: Router,
    public toastController: ToastController,
    private loaderService: LoaderService,
    public mesaService:MesaService
  ) { }

  ngOnInit() {
    this.pedido = this.pedidosService.platosPedidos;
    this.importeTotal = this.pedidosService.importeTotal;
    this.usuario = this.authService.infoUsuario();
    this.getMesa();
  }

  async presentToast(messageText: string) {
    const toast = await this.toastController.create({
      message: messageText,
      duration: 2000
    });
    toast.present();
  }

  confirmar() {
    this.loaderService.showLoader();
    if (this.pedido != null && this.importeTotal > 0) {
      let usuario ={
        nombre:this.usuario.nombre,
        apellido:this.usuario.apellido ? this.usuario.apellido: '',
        uid:this.authService.userData.uid
      }
      let pedido = {
        estado:'pendiente',
        bebidas: {
          platos:this.pedido.filter((x)=>{
            return x.tipo == 'bebida';
          }),
          estado:'pendiente'
        },
        comidas:{
          platos:this.pedido.filter((x)=>{
            return x.tipo == 'comida';
          }),
          estado:'pendiente'
        },
        cliente:usuario,
        importeTotal: this.importeTotal,
        mesa:this.mesa[0]

      }
      console.log(this.mesa);
       this.pedidosService.guardarPedido(pedido).then((res) => {
        this.loaderService.hideLoader();
        this.presentToast("Su pedido ha sido enviado.")
        this.router.navigate(['principal']);
      }).catch((err) => {
        this.loaderService.hideLoader();
        this.presentToast("Ha ocurrido un error vuelva a intentarlo mas tarde.")
      });
    }
    else {
      this.loaderService.hideLoader();
      this.presentToast("Ha ocurrido un error vuelva a intentarlo mas tarde.")
    }
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
