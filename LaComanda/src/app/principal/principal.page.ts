import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../servicios/auth.service';
import { LoaderService } from '../servicios/loader.service';
import { MenuService } from '../servicios/menu.service';
import { UsuarioService } from '../servicios/usuario.service';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.page.html',
  styleUrls: ['./principal.page.scss'],
})
export class PrincipalPage implements OnInit {
  public info;
  public platos = [];
  public loggedUser:any;
  constructor(
    private authService: AuthService,
    private router: Router,
    private menuService:MenuService,
    private loaderService: LoaderService,
    private usuarioService: UsuarioService) { }

  ngOnInit() {
    this.info = this.authService.infoUsuario();
    this.getPlatos();
  }

  irA(ruta){
    this.router.navigate([ruta]);
  }

  salir()
  {
    this.authService.SignOut().then(()=>{
      this.router.navigate(['home']);
    });
  }
  

  getPlatos()
  {
    this.loaderService.showLoader();
    let platos = [];
    this.menuService.getPlatos().subscribe(x => {
      x.forEach(item => {
        platos.push({
          nombre: item.data().nombre,
          descripcion: item.data().descripcion,
          importe: item.data().importe,
          fotos:item.data().fotos,
          id: item.id
        });
      });
      this.platos = platos;
      this.loaderService.hideLoader();
    });
  }

}
