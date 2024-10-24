import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImpressumDatenschutzComponent } from './impressum-datenschutz.component';

describe('ImpressumDatenschutzComponent', () => {
  let component: ImpressumDatenschutzComponent;
  let fixture: ComponentFixture<ImpressumDatenschutzComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImpressumDatenschutzComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImpressumDatenschutzComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
