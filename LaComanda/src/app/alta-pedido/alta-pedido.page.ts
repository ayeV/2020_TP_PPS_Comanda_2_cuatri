import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { AuthService } from '../servicios/auth.service';
import { FcmService } from '../servicios/fcm.service';
import { LoaderService } from '../servicios/loader.service';
import { MenuService } from '../servicios/menu.service';
import { PedidosService } from '../servicios/pedidos.service';
import { UsuarioService } from '../servicios/usuario.service';

@Component({
  selector: 'app-alta-pedido',
  templateUrl: './alta-pedido.page.html',
  styleUrls: ['./alta-pedido.page.scss'],
})
export class AltaPedidoPage implements OnInit {
  public info;
  public platos = [];
  public loggedUser: any;
  public cantidad = 0;
  public platosPedidos = [];
  public importeTotal = 0;
  constructor(private authService: AuthService,
    private router: Router,
    private menuService: MenuService,
    private loaderService: LoaderService,
    public fcmService: FcmService,
    public toastController: ToastController,
    public pedidosService: PedidosService) { }

  ngOnInit() {
    this.info = this.authService.infoUsuario();
    this.getPlatos();
  }


  async presentToast(message) {
    const toast = await this.toastController.create({
      message: message,
      duration: 8000
    });
    toast.present();
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
          tipo: item.data().tipo,
          cantidad: 0
        });
      });
      this.platos = platos;
      this.loaderService.hideLoader();
    });
  }

  agregar(plato) {
    plato.cantidad++;
    this.importeTotal += plato.importe;
  }

  quitar(plato) {
    if (plato.cantidad > 0) {
      plato.cantidad--;
      this.importeTotal -= plato.importe;
    }
  }

  hacerPedido()
  {
    let pedidos = this.platos.filter((c)=>{
      return c.cantidad > 0;
    })
    this.pedidosService.importeTotal = this.importeTotal;
    this.pedidosService.platosPedidos = pedidos;
    this.pedidosService.calcularImportes();
    this.router.navigate(['confirmar-pedido']);
  }


}
