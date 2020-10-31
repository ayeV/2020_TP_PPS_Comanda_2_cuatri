import { Component, OnInit } from '@angular/core';
import { PedidosService } from '../servicios/pedidos.service';

@Component({
  selector: 'app-confirmar-pedido',
  templateUrl: './confirmar-pedido.page.html',
  styleUrls: ['./confirmar-pedido.page.scss'],
})
export class ConfirmarPedidoPage implements OnInit {

  public pedido = [];
  public importeTotal = 0;
  constructor(private pedidosService: PedidosService) { }

  ngOnInit() {
    this.pedido = this.pedidosService.platosPedidos;
    this.importeTotal = this.pedidosService.importeTotal;
  }

  confirmar()
  {
    
  }

}
