import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Entropy } from './entropy';

describe('Entropy', () => {
  let component: Entropy;
  let fixture: ComponentFixture<Entropy>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Entropy]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Entropy);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
