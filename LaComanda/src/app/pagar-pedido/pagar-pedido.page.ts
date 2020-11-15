import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { AuthService } from '../servicios/auth.service';
import { LoaderService } from '../servicios/loader.service';
import { MesaService } from '../servicios/mesa.service';
import { PedidosService } from '../servicios/pedidos.service';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';

@Component({
  selector: 'app-pagar-pedido',
  templateUrl: './pagar-pedido.page.html',
  styleUrls: ['./pagar-pedido.page.scss'],
})
export class PagarPedidoPage implements OnInit {

  public pedido;
  public propina:number;
  constructor(private pedidosService: PedidosService,
    private authService: AuthService,
    public router: Router,
    public toastController: ToastController,
    private loaderService: LoaderService,
    public mesaService: MesaService,
    private barcodeScanner: BarcodeScanner
    ) { }

  ngOnInit() {
    this.getPedido();
  }

  async presentToast(message) {
    const toast = await this.toastController.create({
      message: message,
      duration: 8000
    });
    toast.present();
  }

  getPedido()
  {
    this.loaderService.showLoader();
    let pedidos = []
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
      this.pedido = pedidos.filter((p)=>{
        return p.cliente.uid == this.authService.userData.uid;
      });
      console.log(this.pedido);
      this.loaderService.hideLoader();
    });
    
  }

  pagar(){
    if (this.pedido[0] != null) {
      this.pedido[0].estado = 'pagado';
      this.pedidosService.updateEstado(this.pedido[0].id, this.pedido[0].estado).then((x) => {
        this.loaderService.hideLoader();
        this.presentToast("Pedido pagado correctamente.");
        this.router.navigate(['principal'])
      }).catch((e) => {
        this.loaderService.hideLoader();
        this.presentToast("Ha ocurrido un error, intente nuevamente mas tarde.");
      });
    }

  }

  agregarPropina(){
    this.barcodeScanner.scan({ formats: "TEXT", resultDisplayDuration: 0 }).then(barcodeData => {
      console.log('Barcode data', barcodeData);
      let json = JSON.parse(barcodeData['text']);
      if (json && json.codigo && json.codigo == 'propina') {
        this.presentToast("Propina agregada correctamente.");
        if(json.valor == 20){
          this.propina = this.pedido[0].importeTotal * (20/100);
          this.pedido[0].importeTotal = this.pedido[0].importeTotal + this.pedido[0].importeTotal * (20/100);
        }
        else if(json.valor == 15)
        {
          this.propina = this.pedido[0].importeTotal * (15/100);
          this.pedido[0].importeTotal = this.pedido[0].importeTotal + this.pedido[0].importeTotal * (15/100);
        }
      }
      else {
        this.presentToast("Código incorrecto. Por favor lea un código QR de propina.")
      }

    }).catch(err => {
      console.log('Error', err);
    });
  }
}
