import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PagarPedidoPageRoutingModule } from './pagar-pedido-routing.module';

import { PagarPedidoPage } from './pagar-pedido.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PagarPedidoPageRoutingModule
  ],
  declarations: [PagarPedidoPage]
})
export class PagarPedidoPageModule {}
