import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlickityCarouselComponent } from './flickity-carousel.component';

describe('FlickityCarouselComponent', () => {
  let component: FlickityCarouselComponent;
  let fixture: ComponentFixture<FlickityCarouselComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FlickityCarouselComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FlickityCarouselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
