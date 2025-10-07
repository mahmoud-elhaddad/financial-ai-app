import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReusableArabdtSpinnerComponent } from './reusable-arabdt-spinner.component';

describe('ReusableArabdtSpinnerComponent', () => {
  let component: ReusableArabdtSpinnerComponent;
  let fixture: ComponentFixture<ReusableArabdtSpinnerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReusableArabdtSpinnerComponent]
    });
    fixture = TestBed.createComponent(ReusableArabdtSpinnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
