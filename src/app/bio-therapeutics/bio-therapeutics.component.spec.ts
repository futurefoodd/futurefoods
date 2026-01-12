import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BioTherapeuticsComponent } from './bio-therapeutics.component';

describe('BioTherapeuticsComponent', () => {
  let component: BioTherapeuticsComponent;
  let fixture: ComponentFixture<BioTherapeuticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BioTherapeuticsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BioTherapeuticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
