import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ListaEsperaService {

  constructor(private db: AngularFirestore) { }

  obtenerLista(){
    return this.db.collection('listaEspera').get();
  }

  obtenerPersonaEnLista(uid){
    return this.db.collection('listaEspera').doc(uid).get();
  }

  agregarALista(uid){
    return this.db.collection('listaEspera').doc(uid).set({
      uid: uid,
      estado: 'espera'
    });
  }

  pasarAConMesa(uid, idMesa){
    return this.db.collection('listaEspera').doc(uid).update({
      estado: 'conMesa',
      mesa: idMesa
    });
  }

  borrarDeLista(uid){
    return this.db.collection('listaEspera').doc(uid).delete();
  }
}
