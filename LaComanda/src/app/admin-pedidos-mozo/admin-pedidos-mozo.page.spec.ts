import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AdminPedidosMozoPage } from './admin-pedidos-mozo.page';

describe('AdminPedidosMozoPage', () => {
  let component: AdminPedidosMozoPage;
  let fixture: ComponentFixture<AdminPedidosMozoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminPedidosMozoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminPedidosMozoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
