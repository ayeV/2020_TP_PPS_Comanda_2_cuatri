import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PrepararPedidoPage } from './preparar-pedido.page';

const routes: Routes = [
  {
    path: '',
    component: PrepararPedidoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PrepararPedidoPageRoutingModule {}
