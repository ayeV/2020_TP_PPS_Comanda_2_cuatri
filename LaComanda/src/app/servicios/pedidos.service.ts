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

  guardarPedido(usuario:any,platos:any,importe:number,estado:string,mesa:any)
  {
    return this.db.collection("pedidos").add({
      estado: estado,
      platos:platos,
      cliente:usuario,
      importeTotal:importe,
      mesa:mesa
    });

  }

}
