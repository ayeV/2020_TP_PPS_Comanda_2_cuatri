import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PagarPedidoPage } from './pagar-pedido.page';

describe('PagarPedidoPage', () => {
  let component: PagarPedidoPage;
  let fixture: ComponentFixture<PagarPedidoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PagarPedidoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PagarPedidoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
