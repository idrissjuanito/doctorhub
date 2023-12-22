import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinalRegComponent } from './final-reg.component';

describe('FinalRegComponent', () => {
  let component: FinalRegComponent;
  let fixture: ComponentFixture<FinalRegComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FinalRegComponent]
    });
    fixture = TestBed.createComponent(FinalRegComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
