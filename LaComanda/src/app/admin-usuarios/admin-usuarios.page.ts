import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { LoaderService } from '../servicios/loader.service';
import { UsuarioService } from '../servicios/usuario.service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http'

@Component({
  selector: 'app-admin-usuarios',
  templateUrl: './admin-usuarios.page.html',
  styleUrls: ['./admin-usuarios.page.scss'],
})
export class AdminUsuariosPage implements OnInit {

  private sendEmailUrl = "https://us-central1-lacomanda-a3726.cloudfunctions.net/sendMail";
  private sendEmailUrl2 = " https://us-central1-lacomanda-a3726.cloudfunctions.net/sendMail2";

  public usuarios = [];
  constructor(
    private UsuarioService: UsuarioService,
    private loaderService: LoaderService,
    public toastController: ToastController,
    private http: HttpClient
  ) { }

  ngOnInit() {
    this.getUsuarios();
  }

  async presentToast(messageText: string) {
    const toast = await this.toastController.create({
      message: messageText,
      duration: 2000
    });
    toast.present();
  }

  getUsuarios() {
    this.loaderService.showLoader();
    let usuarios = [];
    this.UsuarioService.getUsuarios().subscribe(x => {
      x.forEach(item => {
        usuarios.push({
          nombre: item.data().nombre,
          apellido: item.data().apellido,
          estado: item.data().estado,
          uid: item.id,
          perfil: item.data().perfil,
          email: item.data().email,
        });
      });
      this.usuarios = usuarios.filter((x) => {
        return x.perfil == 'cliente' && x.estado == 'pendiente';
      });
      console.log(this.usuarios);
      this.loaderService.hideLoader();
    });
  }

  aceptarCliente(usuario) {
    this.loaderService.showLoader();
    usuario.estado = 'aceptado';
    this.UsuarioService.updateEstado(usuario.uid, usuario.estado).then((x) => {
      this.sendEmailAceptado(usuario.email);
      let listaModificada = [];
      for (let i = 0; i < this.usuarios.length; i++) {
        if (usuario.uid == this.usuarios[i].uid) {
          listaModificada.push(usuario);
        }
        else {
          listaModificada.push(this.usuarios[i]);
        }

      }
      this.usuarios = listaModificada;
      this.loaderService.hideLoader();
      this.presentToast("Cliente aceptado correctamente.");
    }).catch((e) => {
      this.loaderService.hideLoader();
      this.presentToast("Ha ocurrido un error, intente nuevamente mas tarde.");
    });

  }
  rechazarCliente(usuario) {
    this.loaderService.showLoader();
    usuario.estado = 'rechazado';
    this.UsuarioService.updateEstado(usuario.uid, usuario.estado).then((x) => {
      this.sendEmailRechazado(usuario.email);
      let listaModificada = [];
      for (let i = 0; i < this.usuarios.length; i++) {
        if (usuario.uid == this.usuarios[i].uid) {
          listaModificada.push(usuario);
        }
        else {
          listaModificada.push(this.usuarios[i]);
        }

      }
      this.usuarios = listaModificada;
      this.loaderService.hideLoader();
      this.presentToast("Cliente rechazado correctamente.");
    }).catch((e) => {
      this.loaderService.hideLoader();
      this.presentToast("Ha ocurrido un error, intente nuevamente mas tarde.");
    });
  }

  sendEmailAceptado(dest) {
    this.http.get(this.sendEmailUrl2 + "?dest=" + dest).subscribe((res) => {
      console.log(res);
    });
  }

  sendEmailRechazado(dest) {
    this.http.get(this.sendEmailUrl + "?dest=" + dest).subscribe((res) => {
      console.log(res);
    });
  }

}
