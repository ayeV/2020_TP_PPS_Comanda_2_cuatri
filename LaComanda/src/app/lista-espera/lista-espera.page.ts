import { Component, OnInit } from '@angular/core';
import { ListaEsperaService } from '../servicios/lista-espera.service';
import { LoaderService } from '../servicios/loader.service';
import { UsuarioService } from '../servicios/usuario.service';

@Component({
  selector: 'app-lista-espera',
  templateUrl: './lista-espera.page.html',
  styleUrls: ['./lista-espera.page.scss'],
})
export class ListaEsperaPage implements OnInit {

  public listaEspera = [];
  public usuarios = {};

  constructor(
    private loaderService: LoaderService,
    private listaEsperaService: ListaEsperaService,
    private usuarioService: UsuarioService
  ) { }

  ngOnInit() {
    this.getListaEspera();
  }

  getListaEspera(){
    this.loaderService.showLoader();
    this.usuarioService.getUsuarios().subscribe(resultado =>{
      resultado.forEach(elemento=>{
        this.usuarios[elemento.id] = {
          nombre: elemento.data().nombre
        }
      });
      this.listaEsperaService.obtenerLista().subscribe((resultado)=>{
        let lista = [];
        resultado.forEach(elemento=>{
          if(elemento.data().estado == 'espera'){
            lista.push({
              nombre: this.usuarios[elemento.data().uid].nombre,
              fecha: elemento.data().fecha
            });
          }
        });
        this.listaEspera = lista.sort((lista1, lista2)=>{
          if(lista1.fecha.toDate().getTime()>=lista2.fecha.toDate().getTime()){
            return 1;
          }
          return -1;
        });
        this.loaderService.hideLoader();
      })
    })

  }

}
