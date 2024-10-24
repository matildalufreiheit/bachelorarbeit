import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SemantischeSucheComponent } from './semantische-suche.component';

describe('SemantischeSucheComponent', () => {
  let component: SemantischeSucheComponent;
  let fixture: ComponentFixture<SemantischeSucheComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SemantischeSucheComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SemantischeSucheComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
