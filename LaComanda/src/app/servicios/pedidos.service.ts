import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Usuario } from '../clases/usuario';

@Injectable({
  providedIn: 'root'
})
export class PedidosService {

  public platosPedidos = [];
  public importeTotal = 0;
  constructor(private db: AngularFirestore) { }


  calcularImportes()
  {
    this.platosPedidos.forEach((c)=>{
      c.importe = c.importe * c.cantidad;
    });
  }

  guardarPedido(pedido:any)
  {
    return this.db.collection("pedidos").add({
      estado: pedido.estado,
      comidas:pedido.comidas,
      bebidas:pedido.bebidas,
      importeTotal:pedido.importeTotal,
      mesa:pedido.mesa,
      cliente:pedido.cliente
    });

  }

  getPedidos()
  {
    return this.db.collection('pedidos').get();
  }

  updateEstado(id,estado) {
    return this.db.collection('pedidos').doc(id).set({
      estado: estado,
    },{merge: true});
  }

}
