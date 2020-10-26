import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(private db: AngularFirestore) { }

  getUsuario(uid){
    return this.db.collection('usuarios').doc(uid).get();
  }

  getUsuarios(){
    return this.db.collection('usuarios');
  }
}
