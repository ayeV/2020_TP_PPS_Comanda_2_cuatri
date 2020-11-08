import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'principal',
    loadChildren: () => import('./principal/principal.module').then( m => m.PrincipalPageModule)
  },
  {
    path: 'alta-supervisor',
    loadChildren: () => import('./alta-supervisor/alta-supervisor.module').then( m => m.AltaSupervisorPageModule)
  },
  {
    path: 'alta-empleado',
    loadChildren: () => import('./alta-empleado/alta-empleado.module').then( m => m.AltaEmpleadoPageModule)
  },
  {
    path: 'alta-cliente',
    loadChildren: () => import('./alta-cliente/alta-cliente.module').then( m => m.AltaClientePageModule)
  },
  {
    path: 'admin-usuarios',
    loadChildren: () => import('./admin-usuarios/admin-usuarios.module').then( m => m.AdminUsuariosPageModule)
  },
  {
    path: 'alta-pedido',
    loadChildren: () => import('./alta-pedido/alta-pedido.module').then( m => m.AltaPedidoPageModule)
  },
  {
    path: 'confirmar-pedido',
    loadChildren: () => import('./confirmar-pedido/confirmar-pedido.module').then( m => m.ConfirmarPedidoPageModule)
  },
  {
    path: 'consulta',
    loadChildren: () => import('./consulta/consulta.module').then( m => m.ConsultaPageModule)
  },
  {
    path: 'admin-pedidos-mozo',
    loadChildren: () => import('./admin-pedidos-mozo/admin-pedidos-mozo.module').then( m => m.AdminPedidosMozoPageModule)
  },
  {
    path: 'modal-pedido',
    loadChildren: () => import('./modal-pedido/modal-pedido.module').then( m => m.ModalPedidoPageModule)
  },  {
    path: 'lista-espera',
    loadChildren: () => import('./lista-espera/lista-espera.module').then( m => m.ListaEsperaPageModule)
  },
  {
    path: 'preparar-pedido',
    loadChildren: () => import('./preparar-pedido/preparar-pedido.module').then( m => m.PrepararPedidoPageModule)
  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
