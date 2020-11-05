import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdminPedidosMozoPageRoutingModule } from './admin-pedidos-mozo-routing.module';

import { AdminPedidosMozoPage } from './admin-pedidos-mozo.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdminPedidosMozoPageRoutingModule
  ],
  declarations: [AdminPedidosMozoPage]
})
export class AdminPedidosMozoPageModule {}
