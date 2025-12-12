import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Carousel } from 'primeng/carousel';
import { ButtonModule } from 'primeng/button';
import { Tag } from 'primeng/tag';
import { UUID } from 'crypto';
import { environment } from '../../../environments/environment';
import { TranslatePipe } from '@ngx-translate/core';
import { WhatsAppService } from '../../services/whatsapp.service';
import { CartService } from '../../services/cartService.service';

interface Product {
  id: string;
  name: string;
  price: number;
  promo_price?: number | null;
  product_rating: number;
  image: string | string[];
  status?: string;
  pic?: string | null;
}

@Component({
  selector: 'app-product-carousel',
  imports: [Carousel, ButtonModule, CommonModule, RouterModule, TranslatePipe],
  templateUrl: './product-carousel.component.html',
  styleUrl: './product-carousel.component.scss'
})
export class ProductCarouselComponent implements OnInit {
  products: Product[] = [];
  baseUrl: string = environment.apiHost;
  apiURL = `${this.baseUrl}/products/getAllProducts`;
  loading: boolean = true;

  responsiveOptions: any[] = [
    {
      breakpoint: '1400px',
      numVisible: 3,
      numScroll: 1
    },
    {
      breakpoint: '1199px',
      numVisible: 3,
      numScroll: 1
    },
    {
      breakpoint: '767px',
      numVisible: 2,
      numScroll: 1
    },
    {
      breakpoint: '575px',
      numVisible: 1,
      numScroll: 1
    }
  ];

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    private router: Router,
    private whatsappService: WhatsAppService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.getAllProducts();
    }
  }

  async getAllProducts(): Promise<void> {
    try {
      const response = await fetch(this.apiURL);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      this.products = data.result || [];
      this.loading = false;
    } catch (err) {
      console.error('There was a problem with the fetch operation:', err);
      this.loading = false;
    }
  }

  async navigateProductDetail(id: UUID): Promise<void> {
    try {
      await this.router.navigate(['product-detail', id]);
      
      if (isPlatformBrowser(this.platformId)) {
        window.scrollTo(0, 0);
      }
    } catch (err) {
      console.error('There was a problem navigating to product-detail/:id:', err);
    }
  }

  getProductImage(product: Product): string {
    if (Array.isArray(product.image)) {
      return product.image[0] || '';
    }
    return product.image || '';
  }

  formatPrice(price: number): string {
    return `RM${price.toFixed(2)}`;
  }

  getRating(product: Product): number {
    const rating = product.product_rating;
    if (typeof rating === 'number') {
      return rating;
    }
    if (typeof rating === 'string') {
      const parsed = parseFloat(rating);
      return isNaN(parsed) ? 0 : parsed;
    }
    return 0;
  }

  hasRating(product: Product): boolean {
    const rating = product.product_rating;
    if (rating === null || rating === undefined) {
      return false;
    }
    if (typeof rating === 'number') {
      return rating > 0;
    }
    if (typeof rating === 'string') {
      const parsed = parseFloat(rating);
      return !isNaN(parsed) && parsed > 0;
    }
    return false;
  }

  hasPromo(product: Product): boolean {
    return product.promo_price !== null && product.promo_price !== undefined && product.promo_price > 0;
  }

  getStatus(product: Product): string | null {
    return product.status || null;
  }

  isSaleStatus(status: string | null): boolean {
    return status === 'sale';
  }

  isComingSoonStatus(status: string | null): boolean {
    return status === 'coming-soon';
  }

  calculateDiscountPercentage(product: Product): number | null {
    if (!this.hasPromo(product) || !product.promo_price || !product.price) {
      return null;
    }
    const discount = ((product.price - product.promo_price) / product.price) * 100;
    return Math.round(discount);
  }

  getDiscountLabel(product: Product): string | null {
    const discount = this.calculateDiscountPercentage(product);
    if (discount && discount > 0) {
      return `-${discount}%`;
    }
    return null;
  }

  openWhatsAppForProduct(event: Event, product: Product): void {
    event.stopPropagation(); // Prevent card click navigation
    const productPrice = this.hasPromo(product) && product.promo_price 
      ? this.formatPrice(product.promo_price) 
      : this.formatPrice(product.price);
    const phoneNumber = product.pic || undefined; // Use pic field if available, otherwise undefined
    this.whatsappService.openProductInquiry(product.name, productPrice, undefined, phoneNumber);
  }

  async addToCart(event: Event, product: Product): Promise<void> {
    event.stopPropagation(); // Prevent card click navigation
    // Redirect to product detail page
    await this.navigateProductDetail(product.id as UUID);
  }
}

