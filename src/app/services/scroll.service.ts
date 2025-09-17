import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ScrollService {
  constructor(@Inject(PLATFORM_ID) private platformId: object) {}

  /**
   * Scroll to top of the page
   */
  scrollToTop(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });
    }
  }

  /**
   * Scroll to a specific position
   * @param x - Horizontal position
   * @param y - Vertical position
   * @param behavior - Scroll behavior ('smooth' or 'auto')
   */
  scrollTo(x: number, y: number, behavior: 'smooth' | 'auto' = 'smooth'): void {
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo({
        top: y,
        left: x,
        behavior: behavior
      });
    }
  }

  /**
   * Scroll to a specific element by ID
   * @param elementId - ID of the element to scroll to
   * @param behavior - Scroll behavior ('smooth' or 'auto')
   */
  scrollToElement(elementId: string, behavior: 'smooth' | 'auto' = 'smooth'): void {
    if (isPlatformBrowser(this.platformId)) {
      const element = document.getElementById(elementId);
      if (element) {
        element.scrollIntoView({
          behavior: behavior,
          block: 'start',
          inline: 'nearest'
        });
      }
    }
  }

  /**
   * Get current scroll position
   * @returns Object with x and y coordinates
   */
  getScrollPosition(): { x: number; y: number } {
    if (isPlatformBrowser(this.platformId)) {
      return {
        x: window.pageXOffset || document.documentElement.scrollLeft,
        y: window.pageYOffset || document.documentElement.scrollTop
      };
    }
    return { x: 0, y: 0 };
  }
}
