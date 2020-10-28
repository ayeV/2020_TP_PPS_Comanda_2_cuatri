import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  constructor(private db: AngularFirestore,private storage: AngularFireStorage,private auth: AuthService) { }

  
  getPlatos() {
    return this.db.collection('platos').get();
  }


}
