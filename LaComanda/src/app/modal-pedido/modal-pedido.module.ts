import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalPedidoPageRoutingModule } from './modal-pedido-routing.module';

import { ModalPedidoPage } from './modal-pedido.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalPedidoPageRoutingModule
  ],
  declarations: [ModalPedidoPage]
})
export class ModalPedidoPageModule {}
