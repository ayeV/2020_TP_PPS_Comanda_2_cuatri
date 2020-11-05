import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-modal-pedido',
  templateUrl: './modal-pedido.page.html',
  styleUrls: ['./modal-pedido.page.scss'],
})
export class ModalPedidoPage implements OnInit {

  @Input() comidas: [];
  @Input() bebidas: [];
  @Input() importeTotal: number;
  constructor(private modalCtrl:ModalController) { }

  ngOnInit() {
  }

  
  dismiss() {
    this.modalCtrl.dismiss({
      'dismissed': true
    });
  }
}
