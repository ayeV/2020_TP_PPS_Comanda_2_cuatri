import { Component, OnInit } from '@angular/core';
import { AuthService } from '../servicios/auth.service';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.page.html',
  styleUrls: ['./principal.page.scss'],
})
export class PrincipalPage implements OnInit {
  public perfil;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    console.log(this.authService.infoUsuario().perfil)
    this.perfil = this.authService.infoUsuario().perfil;
  }

}
