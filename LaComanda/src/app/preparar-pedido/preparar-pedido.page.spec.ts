import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PrepararPedidoPage } from './preparar-pedido.page';

describe('PrepararPedidoPage', () => {
  let component: PrepararPedidoPage;
  let fixture: ComponentFixture<PrepararPedidoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrepararPedidoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PrepararPedidoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
