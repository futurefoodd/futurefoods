import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterModule } from '@angular/router';
import {  AfterViewInit, ElementRef, ViewChild, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ImageCompareModule } from 'primeng/imagecompare';
import { CircularCarouselComponent } from '../../widgets/circular-carousel/circular-carousel.component';

@Component({
  selector: 'app-landing-page',
  imports: [CommonModule, RouterModule,  RouterLink, ImageCompareModule, CircularCarouselComponent],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss'
})
export class LandingPageComponent implements OnInit {
  // slides: any[] = new Array(3).fill({ id: -1, src: '', title: '', subtitle: '' });
  constructor(@Inject(PLATFORM_ID) private platformId: object){
    this.interval  = isPlatformBrowser(this.platformId) ? 5000 : 0;
   }
  interval:any
  // ngOnInit(): void {
    // if (isPlatformBrowser(this.platformId)){

    //   this.slides[0] = {
    //     id: 1,
    //     src: 'carousel_1.png',
    //     title: 'Example',
    //     subtitle: 'Sad'
    //   };
     
    //   this.slides[1] = {
    //     id: 2,
    //     src: 'carousel_1.png',
    //     title: 'Example',
    //     subtitle: 'Sad'
    //   };
    //   this.slides[2] = {
    //     id: 3,
    //     src: 'carousel_1.png',
    //     title: 'Example',
    //     subtitle: 'Sad'
    //   };
    // }
  // }

  // @ViewChild('carousel', { static: false }) carouselEl!: ElementRef;
  

  // async ngAfterViewInit() {
  //   if (isPlatformBrowser(this.platformId)) {
  //     const Flickity = (await import('flickity')).default;
  //     new Flickity(this.carouselEl.nativeElement, {
  //       cellAlign: 'left',
  //       contain: true,
  //       autoPlay: true,
  //       wrapAround: true
  //     });
  //   }
  // }
  logos = [
    { text: 'Google', logo: 'assets/logos/google.png' },
    { text: 'Microsoft', logo: 'assets/logos/microsoft.svg' },
    { text: 'Amazon', logo: 'assets/logos/amazon.svg' },
    { text: 'Apple', logo: 'assets/logos/apple.svg' },
    { text: 'Meta', logo: 'assets/logos/meta.svg' },
    { text: 'Netflix', logo: 'assets/logos/netflix.svg' }
  ];

  // For the infinite carousel effect
  get duplicatedLogos() {
    return [...this.logos, ...this.logos];
  }

  public images: string[] = [
    'image_1.png',
    'https://placehold.co/800x450/4ade80/FFFFFF/png?text=Slide+2',
    'https://placehold.co/800x450/60a5fa/FFFFFF/png?text=Slide+3',
    'https://placehold.co/800x450/c084fc/FFFFFF/png?text=Slide+4'
  ];

  public currentImageIndex = 0;
  public currentImageUrl: string = '';
  

  ngOnInit(): void {
    // Set the initial image when the component loads.
    this.updateImage();
  }

  /**
   * Updates the displayed image based on the current index.
   */
  private updateImage(): void {
    this.currentImageUrl = this.images[this.currentImageIndex];
  }

  /**
   * Navigates to the next slide in the array.
   * It loops back to the beginning if it reaches the end.
   */
  public nextSlide(): void {
    this.currentImageIndex = (this.currentImageIndex + 1) % this.images.length;
    this.updateImage();
  }

  /**
   * Navigates to the previous slide in the array.
   * It loops back to the end if it goes past the first slide.
   */
  public prevSlide(): void {
    this.currentImageIndex = (this.currentImageIndex - 1 + this.images.length) % this.images.length;
    this.updateImage();
  }

  /**
   * Jumps to a specific slide based on its index.
   * @param index The index of the slide to navigate to.
   */
  public goToSlide(index: number): void {
    this.currentImageIndex = index;
    this.updateImage();
  }

}
