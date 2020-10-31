import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PedidosService {

  public platosPedidos = [];
  public importeTotal = 0;
  constructor() { }


  calcularImportes()
  {
    this.platosPedidos.forEach((c)=>{
      c.importe = c.importe * c.cantidad;
    });
  }

}
