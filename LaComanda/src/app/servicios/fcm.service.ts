import { Injectable } from '@angular/core';
import {
  Plugins,
  PushNotification,
  PushNotificationToken,
  PushNotificationActionPerformed,
  Capacitor
} from '@capacitor/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from './auth.service';
const { PushNotifications } = Plugins;


@Injectable({
  providedIn: 'root'
})
export class FcmService {

  private key = "AAAABN6fxWI:APA91bFr9E8xcRGa1uKM4se-mizX1sClINuwpIYGB9Cg3OBgUBvCNM58J2nwDgwFwzG77itfQll3o5-QYAJ_vQcJfl0iCDJBli79M9iq4Ejo9Y2gKAzHEq_A6N0UYpJPsMAJa-7dNh6G"
  private url = "https://fcm.googleapis.com/fcm/send"
  constructor(private db: AngularFirestore, private authService: AuthService, private http: HttpClient){}

  guardarToken(token){
    let uid = this.authService.userData.uid;
    return this.db.collection('devices').doc(uid).set({
      token: token,
      uid: uid
    })
  }

  sendNotification(message){
    let header = {"Authorization": `key=${this.key}`};
    console.log(header);
    this.http.post(this.url, {
      "notification": {
        title: "Mensaje",
        body: message
      },
      "to": "dmj93iJ4SCefhS1rG8evia:APA91bGnilVk5EPZR5ETYScYDqqwaURntnx17Z6MXq6OEomyYS9Tn2sjCAsQFnIxBBhtBtyDOMxevOipagDbjh2KprK09WoEtLbxew_kGrZz2SNVaSujMKYLt-X3zBBg2AmjtAsgQJRO"
    },{headers: header}).subscribe((response)=>{
      console.log(response);
    });
  }

  sendNotificationNewCustomer(){
    let header = {"Authorization": `key=${this.key}`};
    console.log(header);
    return this.http.post(this.url, {
      "notification": {
        title: "Mensaje",
        body: 'Se ha registrado un nuevo usuario'
      },
      "to": "/topics/registro"
    },{headers: header})
  }
}
