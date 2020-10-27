import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Usuario } from '../clases/usuario';
import { AngularFireStorage } from '@angular/fire/storage';
import { AuthService } from './auth.service';
import * as firebase from 'firebase';


@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  public uploadTask: firebase.storage.UploadTask;
  public storageRef;

  constructor(private db: AngularFirestore,private storage: AngularFireStorage,private auth: AuthService) { 
    this.storageRef = firebase.storage().ref();

  }

  getUsuario(uid) {
    return this.db.collection('usuarios').doc(uid).get();
  }

  getUsuarios() {
    return this.db.collection('usuarios');
  }



  postUsuario(uid, user: Usuario) {
    return this.db.collection("usuarios").doc(uid).set({
      nombre: user.nombre,
      apellido: user.apellido,
      dni: user.dni,
      cuil: user.cuil,
      foto: null,
      perfil: user.perfil,
      estado: user.estado,
      tipo:user.tipo,
      uid:uid

    });

  }

  updateUserPic(id,url) {
    return this.db.collection('usuarios').doc(id).set({
      foto: url,
    },{merge: true});
  }


  uploadFile(dataUrl) {
    var fileName = `${new Date().getTime()}photo`;
    var ref = firebase.storage().ref().child("usuarios/" + fileName);

     this.uploadTask = ref.putString(dataUrl, 'data_url');
     return this.uploadTask;
  }

}
