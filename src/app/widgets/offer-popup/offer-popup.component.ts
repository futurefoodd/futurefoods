import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-offer-popup',
  imports: [CommonModule, TranslatePipe],
  templateUrl: './offer-popup.component.html',
  styleUrl: './offer-popup.component.scss'
})
export class OfferPopupComponent implements OnInit, OnDestroy {
  showPopup: boolean = false;
  private readonly STORAGE_KEY = 'offer_popup_dismissed';

  constructor(
    @Inject(PLATFORM_ID) private platformId: object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Check if popup was previously dismissed
      const dismissed = localStorage.getItem(this.STORAGE_KEY);
      if (!dismissed) {
        // Show popup after a short delay for better UX
        setTimeout(() => {
          this.showPopup = true;
          // Prevent body scroll when popup is open
          document.body.style.overflow = 'hidden';
        }, 500);
      }
    }
  }

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId)) {
      document.body.style.overflow = '';
    }
  }

  closePopup(): void {
    this.showPopup = false;
    if (isPlatformBrowser(this.platformId)) {
      // Save dismissal to localStorage
      localStorage.setItem(this.STORAGE_KEY, 'true');
      // Restore body scroll
      document.body.style.overflow = '';
    }
  }

  scrollToCarousel(): void {
    this.closePopup();
    if (isPlatformBrowser(this.platformId)) {
      // Wait a bit for the popup to close, then scroll to carousel
      setTimeout(() => {
        const carouselSection = document.querySelector('.product-carousel-section');
        if (carouselSection) {
          carouselSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 300);
    }
  }
}

