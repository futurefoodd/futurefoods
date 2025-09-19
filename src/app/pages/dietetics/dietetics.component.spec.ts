import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DieteticsComponent } from './dietetics.component';

describe('DieteticsComponent', () => {
  let component: DieteticsComponent;
  let fixture: ComponentFixture<DieteticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DieteticsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DieteticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
