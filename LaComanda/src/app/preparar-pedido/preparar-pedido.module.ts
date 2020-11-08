import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PrepararPedidoPageRoutingModule } from './preparar-pedido-routing.module';

import { PrepararPedidoPage } from './preparar-pedido.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PrepararPedidoPageRoutingModule
  ],
  declarations: [PrepararPedidoPage]
})
export class PrepararPedidoPageModule {}
