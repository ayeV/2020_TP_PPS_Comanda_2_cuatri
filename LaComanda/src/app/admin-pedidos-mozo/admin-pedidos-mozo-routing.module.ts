import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminPedidosMozoPage } from './admin-pedidos-mozo.page';

const routes: Routes = [
  {
    path: '',
    component: AdminPedidosMozoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminPedidosMozoPageRoutingModule {}
