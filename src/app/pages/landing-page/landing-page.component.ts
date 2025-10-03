import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterModule } from '@angular/router';
import {  AfterViewInit, ElementRef, ViewChild, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ImageCompareModule } from 'primeng/imagecompare';
import { CircularCarouselComponent } from '../../widgets/circular-carousel/circular-carousel.component';
import { FlickityCarouselComponent } from '../../widgets/flickity-carousel/flickity-carousel.component';
import { FormsModule } from '@angular/forms';
import { FaqComponent } from '../../widgets/faq/faq.component';
import { WhatsAppService } from '../../services/whatsapp.service';
import { ScrollService } from '../../services/scroll.service';
import { UUID } from 'crypto';

@Component({
  selector: 'app-landing-page',
  imports: [ RouterModule, ImageCompareModule, FormsModule, CommonModule, FaqComponent],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss'
})
export class LandingPageComponent implements OnInit, OnDestroy {
  quantity=0;
  // slides: any[] = new Array(3).fill({ id: -1, src: '', title: '', subtitle: '' });
  private autoSlideInterval: any;
  // private readonly slideInterval = 7000; // 5 seconds between slides
  
  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    private whatsappService: WhatsAppService,
    private router: Router,
    private scrollService: ScrollService
  ){
    // Only run auto-slide in browser environment
    if (isPlatformBrowser(this.platformId)) {
      // this.startAutoSlide();
    }
  }
  async navigateProductDetail(id: UUID){
    // console.log(this.route)
        try{
          await this.router.navigate(['product-detail', id]);
          
          // Scroll to top after navigation
          if (isPlatformBrowser(this.platformId)) {
            window.scrollTo(0, 0);
          }
    
          // const response = await this.requestService.requestHelper(`/getProduct/${id}`, "GET")
          // if(!response.ok){
          //   throw new Error(`HTTP error! Status: ${response.status}`);
          // }
          // const data = await response.json();
        }catch(err){
          console.error('There was a problem navigating to product-detail/:id:', err);
        }
      }
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
  // selectedProduct: string = 'productA';
  // products = {
  //   productA: {
  //     title: 'Product A',
  //     image: '2_box_deal.png'
  //   },
  //   productB: {
  //     title: 'Product B',
  //     image: '1_box_deal.png'
  //   }
  // };


  public images: string[] = [
    'landing_image_1.webp',
    'landing_image_2.webp',
    'landing_image_3.webp',
    'landing_image_4.webp',
  ];

  public currentImageIndex = 0;
  public currentImageUrl: string = '';
  
  public testimonyData = [
    {
      id:1,
      title: 'Fitness Enthusiast',
      name: 'Carol Lee',
      testimony: 'These nutrient rich soft pastilles helps your good bacteria in your gut to grow and stay strong. Your own probiotics help you better digest food and absorb important nutrients, can stop sugar cravings and even improve your mood.',
      image: 'https://via.placeholder.com/150/FF5733/FFFFFF?text=Jane',
    },
    {
      id:2,
      title: 'Deputy Director, MOE',
      name: 'Kathijah Ibrahim',
      testimony: 'These soft pastilles are well formulated to help your body better absorb natural vitamin C, amino acids, dietary calcium and magnesium for muscle recovery and stronger bones. I also have improved joint flexibility and have less pain',
      image: 'https://via.placeholder.com/150/33FF57/FFFFFF?text=David',
    },
    {
      id:3,
      title: 'Founder of OPIKA ORGANIC',
      name: 'Selina Gan',
      testimony: 'I feel the Omega 3, MCTs and B vitamins are easily and quickly absorbed in my mouth. I quickly get natural energy to rebound after workouts, recover from daily tiredness and also very much less brain fog.',
      image: 'https://via.placeholder.com/150/3357FF/FFFFFF?text=Emily',
    }
]

  ngOnInit(): void {
    // Set the initial image when the component loads.
    this.updateImage();
  }

  ngOnDestroy(): void {
    // Clean up the interval when component is destroyed
    // this.stopAutoSlide();
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
    // this.resetAutoSlide(); // Reset auto-slide timer when manually navigating
  }

  /**
   * Navigates to the previous slide in the array.
   * It loops back to the end if it goes past the first slide.
   */
  public prevSlide(): void {
    this.currentImageIndex = (this.currentImageIndex - 1 + this.images.length) % this.images.length;
    this.updateImage();
    // this.resetAutoSlide(); // Reset auto-slide timer when manually navigating
  }

  /**
   * Jumps to a specific slide based on its index.
   * @param index The index of the slide to navigate to.
   */
  public goToSlide(index: number): void {
    this.currentImageIndex = index;
    this.updateImage();
    // this.resetAutoSlide(); // Reset auto-slide timer when manually navigating
  }

  /**
   * Starts the auto-slide functionality
   */
  // private startAutoSlide(): void {
  //   this.autoSlideInterval = setInterval(() => {
  //     this.nextSlide();
  //   }, this.slideInterval);
  // }

  /**
   * Stops the auto-slide functionality
   */
  // private stopAutoSlide(): void {
  //   if (this.autoSlideInterval) {
  //     clearInterval(this.autoSlideInterval);
  //     this.autoSlideInterval = null;
  //   }
  // }

  /**
   * Resets the auto-slide timer
   */
  // private resetAutoSlide(): void {
  //   this.stopAutoSlide();
  //   this.startAutoSlide();
  // }

  /**
   * Pauses auto-slide when user hovers over the slideshow
   */
  // public onSlideshowHover(): void {
  //   this.stopAutoSlide();
  // }

  // /**
  //  * Resumes auto-slide when user stops hovering over the slideshow
  //  */
  // public onSlideshowLeave(): void {
  //   this.startAutoSlide();
  // }

  /**
   * Opens WhatsApp for product inquiry
   */
  public openWhatsApp(): void {
    this.whatsappService.openWhatsApp('landing');
  }

}
