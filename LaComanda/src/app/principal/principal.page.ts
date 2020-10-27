import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../servicios/auth.service';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.page.html',
  styleUrls: ['./principal.page.scss'],
})
export class PrincipalPage implements OnInit {
  public perfil;

  constructor(
    private authService: AuthService,
    private router: Router) { }

  ngOnInit() {
    console.log(this.authService.infoUsuario())
    this.perfil = this.authService.infoUsuario().perfil;
  }

  irA(ruta){
    this.router.navigate([ruta]);
  }

}
