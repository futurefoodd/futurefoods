import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterModule } from '@angular/router';
import {  AfterViewInit, ElementRef, ViewChild, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ImageCompareModule } from 'primeng/imagecompare';
import { CircularCarouselComponent } from '../../widgets/circular-carousel/circular-carousel.component';
import { FlickityCarouselComponent } from '../../widgets/flickity-carousel/flickity-carousel.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-landing-page',
  imports: [ RouterModule,  RouterLink, ImageCompareModule, FormsModule, CommonModule],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss'
})
export class LandingPageComponent implements OnInit {
  quantity=0;
  // slides: any[] = new Array(3).fill({ id: -1, src: '', title: '', subtitle: '' });
  constructor(@Inject(PLATFORM_ID) private platformId: object){
    this.interval  = isPlatformBrowser(this.platformId) ? 5000 : 0;
   }
  interval:any
  // logos = [
  //   { text: 'Google', logo: 'assets/logos/google.png' },
  //   { text: 'Microsoft', logo: 'assets/logos/microsoft.svg' },
  //   { text: 'Amazon', logo: 'assets/logos/amazon.svg' },
  //   { text: 'Apple', logo: 'assets/logos/apple.svg' },
  //   { text: 'Meta', logo: 'assets/logos/meta.svg' },
  //   { text: 'Netflix', logo: 'assets/logos/netflix.svg' }
  // ];

  // For the infinite carousel effect
  // get duplicatedLogos() {
  //   return [...this.logos, ...this.logos, ...this.logos];
  // }
  selectedProduct: string = 'productA';
  products = {
    productA: {
      title: 'Product A',
      image: '2_box_deal.png'
    },
    productB: {
      title: 'Product B',
      image: '1_box_deal.png'
    }
  };

  public images: string[] = [
    'landing_image_1.svg',
    'https://placehold.co/800x450/4ade80/FFFFFF/png?text=Slide+2',
    'https://placehold.co/800x450/60a5fa/FFFFFF/png?text=Slide+3',
    'https://placehold.co/800x450/c084fc/FFFFFF/png?text=Slide+4'
  ];

  public currentImageIndex = 0;
  public currentImageUrl: string = '';
  
  public testimonyData = [
    {
      id:1,
      title: 'Fitness Enthusiast',
      name: 'Jane Doe',
      testimony: 'I was skeptical at first, but this supplement has completely changed my daily routine. I used to feel sluggish by the afternoon, but now I have consistent energy all day!',
      image: 'https://via.placeholder.com/150/FF5733/FFFFFF?text=Jane',
    },
    {
      id:2,
      title: 'Software Engineer',
      name: 'David Chen',
      testimony: 'This supplement not only helped me combat that lethargy, but I\'ve also seen a noticeable improvement in my skin\'s texture and radiance. It\'s a fantastic two-in-one benefit that I can\'t recommend enough.',
      image: 'https://via.placeholder.com/150/33FF57/FFFFFF?text=David',
    },
    {
      id:3,
      title: 'University Student',
      name: 'Emily White',
      testimony: 'Between classes and my part-time job, I was constantly exhausted. Since starting this supplement, I\'ve had so much more energy to get through my day. It\'s a great product that delivers on its promises.',
      image: 'https://via.placeholder.com/150/3357FF/FFFFFF?text=Emily',
    }
]

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
