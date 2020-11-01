import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class MesaService {
  public idMesa;

  constructor(private db: AngularFirestore) { }

  obtenerMesa(idMesa){
    return this.db.collection('mesas').doc(idMesa).get();
  }

  tomarMesa(idMesa, uid){
    return this.db.collection('mesas').doc(idMesa).update({
      estado: 'ocupada',
      cliente: uid
    });
  }
}
