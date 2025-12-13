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
  private readonly EXPIRATION_DAYS = 1; // Set expiration to 1 day

  constructor(
    @Inject(PLATFORM_ID) private platformId: object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Check if popup was previously dismissed and not expired
      const dismissed = this.isPopupDismissed();
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

  private isPopupDismissed(): boolean {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (!stored) {
      return false;
    }

    try {
      const data = JSON.parse(stored);
      const expirationTime = data.expirationTime;
      
      // Check if expired
      if (Date.now() > expirationTime) {
        localStorage.removeItem(this.STORAGE_KEY);
        return false;
      }
      
      return true;
    } catch (e) {
      // If parsing fails, treat as not dismissed (handles old format)
      localStorage.removeItem(this.STORAGE_KEY);
      return false;
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
      // Save dismissal to localStorage with expiration (1 day)
      const expirationTime = Date.now() + (this.EXPIRATION_DAYS * 24 * 60 * 60 * 1000);
      const data = {
        dismissed: true,
        expirationTime: expirationTime
      };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
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

