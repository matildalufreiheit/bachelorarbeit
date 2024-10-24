import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BeratungsangeboteComponent } from './beratungsangebote.component';

describe('BeratungsangeboteComponent', () => {
  let component: BeratungsangeboteComponent;
  let fixture: ComponentFixture<BeratungsangeboteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BeratungsangeboteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BeratungsangeboteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
