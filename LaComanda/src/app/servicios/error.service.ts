import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  private errors;

  constructor() {
    this.errors = {
      "auth/invalid-email": "Ingrese correo con formato válido",
      "auth/wrong-password": "Clave incorrecta",
      "auth/user-not-found": "No se encuentra el usuario"
    }
   }

  translate(error){
    return this.errors[error];
  }
}
