import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
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
import {TranslatePipe, TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-landing-page',
  imports: [ RouterModule, ImageCompareModule, FormsModule, CommonModule, FaqComponent, TranslatePipe],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss'
})
export class LandingPageComponent implements OnInit, OnDestroy {
  
  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    private whatsappService: WhatsAppService,
    private router: Router,
    private scrollService: ScrollService,
    private translate: TranslateService
  ){
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


  public images: string[] = [
    'landing_image_1.webp',
    'landing_image_2.webp',
    'landing_image_3.webp',
    'landing_image_4.webp',
  ];

  public currentImageIndex = 0;
  public currentImageUrl: string = '';
  public modalVisible: boolean = false;
  public modalImageUrl: string = '';
  
  public testimonyData = [
    {
      id:1,
      title: 'Landing.Testimony.testimony_1.title',
      name: 'Landing.Testimony.testimony_1.name',
      testimony: 'Landing.Testimony.testimony_1.description',
      image: 'https://via.placeholder.com/150/FF5733/FFFFFF?text=Jane',
    },
    {
      id:2,
      title: 'Landing.Testimony.testimony_2.title',
      name: 'Landing.Testimony.testimony_2.name',
      testimony: 'Landing.Testimony.testimony_2.description',
      image: 'https://via.placeholder.com/150/33FF57/FFFFFF?text=David',
    },
    {
      id:3,
      title: 'Landing.Testimony.testimony_3.title',
      name: 'Landing.Testimony.testimony_3.name',
      testimony: 'Landing.Testimony.testimony_3.description',
      image: 'https://via.placeholder.com/150/3357FF/FFFFFF?text=Emily',
    },
    {
      id:4,
      title: 'Landing.Testimony.testimony_4.title',
      name: 'Landing.Testimony.testimony_4.name',
      testimony: 'Landing.Testimony.testimony_4.description',
      image: 'https://via.placeholder.com/150/FF6B9D/FFFFFF?text=Carine',
    }
]

  ngOnInit(): void {
    // Set the initial image when the component loads.
    this.updateImage();
  }

  ngOnDestroy(): void {
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

  /**
   * Opens WhatsApp for product inquiry
   */
  public openWhatsApp(): void {
    this.whatsappService.openWhatsApp('landing');
  }

  /**
   * Opens WhatsApp for single product purchase
   */
  public openWhatsAppSingleProduct(): void {
    const message = 'Hello! I\'m interested in purchasing 1 Pro-Collagen Soft Pastilles box (RM150.00). Can you help me complete my order?';
    this.whatsappService.openWhatsApp('landing', message);
  }

  /**
   * Opens WhatsApp for two products purchase (best value)
   */
  public openWhatsAppTwoProducts(): void {
    const message = 'Hello! I\'m interested in purchasing 2 Pro-Collagen Soft Pastilles boxes (RM240.00 - Best Value Offer). Can you help me complete my order?';
    this.whatsappService.openWhatsApp('landing', message);
  }

  /**
   * Opens the image modal with the current image
   */
  public openImageModal(): void {
    this.modalImageUrl = this.currentImageUrl;
    this.modalVisible = true;
    // Prevent body scroll when modal is open
    if (isPlatformBrowser(this.platformId)) {
      document.body.style.overflow = 'hidden';
    }
  }

  /**
   * Closes the image modal
   */
  public closeImageModal(): void {
    this.modalVisible = false;
    // Restore body scroll
    if (isPlatformBrowser(this.platformId)) {
      document.body.style.overflow = '';
    }
  }

  /**
   * Handles keyboard events for modal (ESC to close)
   */
  @HostListener('document:keydown.escape', ['$event'])
  handleEscapeKey(event: KeyboardEvent): void {
    if (this.modalVisible) {
      this.closeImageModal();
    }
  }

}
