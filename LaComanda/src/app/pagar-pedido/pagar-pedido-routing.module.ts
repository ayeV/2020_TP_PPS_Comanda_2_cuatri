import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PagarPedidoPage } from './pagar-pedido.page';

const routes: Routes = [
  {
    path: '',
    component: PagarPedidoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagarPedidoPageRoutingModule {}
