import { Component, OnInit, model, ViewChild, ElementRef, PLATFORM_ID, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import {FormsModule} from '@angular/forms'
import { TranslatePipe } from '@ngx-translate/core';
import { FlickityCarouselComponent } from '../../widgets/flickity-carousel/flickity-carousel.component';
import { productImage } from '../../core/model/product.model';
import { WhatsAppService } from '../../services/whatsapp.service';
import { environment } from '../../../environments/environment';
import { VideoPlayerComponent, VideoSource } from '../../components/video-player/video-player.component';


// type productImage = {
//   itemImageSrc: string | null,
//   thumbnailImageSrc: string | null,
//   alt:  string | null,
//   title:  string | null
// }

@Component({
  selector: 'app-product-detail',
  imports: [CommonModule, FormsModule, TranslatePipe, FlickityCarouselComponent, VideoPlayerComponent],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss',
  providers: []
})
export class ProductDetailComponent implements OnInit {
  modalVisible: boolean = false
  @ViewChild('myModal') myModal!: ElementRef<HTMLDivElement>;
  @ViewChild('modalImage') modalImage!: ElementRef<HTMLImageElement>;
  @ViewChild('caption') caption!: ElementRef<HTMLDivElement>;
  private platformId = inject(PLATFORM_ID);
  product: any = { 0: { name: '', price: '', description_1: '', description_2: '', status: 'sale' } };
  imageObject: productImage[] = []

  baseUrl:string = environment.apiHost

  productSpecification:any

  nutrientsTableImage: any
  expanded = false;

  unitName:string= "box"
  unitQuantity:string = ''

  videoPoster = '';
  videoSources: VideoSource[] = [];

  constructor(
    private activatedRoute: ActivatedRoute, 
    private whatsappService: WhatsAppService
  ) {

  }

  // readonly videoSources: VideoSource[] = [
  //   {
  //     src: 'https://cdotngdpjgeeybbfdoit.supabase.co/storage/v1/object/public/nvc/public/videos/ancestral_video.mp4',
  //     type: 'video/mp4',
  //   },
  //   {
  //     src: 'https://cdotngdpjgeeybbfdoit.supabase.co/storage/v1/object/public/nvc/videos/upskill-story-1080p.webm',
  //     type: 'video/webm',
  //   },
  // ];

  async ngOnInit(): Promise<void> {
    if (isPlatformBrowser(this.platformId)) {
      try {
        const params = await firstValueFrom(this.activatedRoute.paramMap)
        const productId = params.get('id')
        
       if(productId){ 
        const response = await fetch(`${this.baseUrl}/products/getProduct/${productId}`)
        if(!response.ok){
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const product= await response.json()
        this.product = product.result

        this.nutrientsTableImage = this.product[0].name + '.png'

        if (this.product && this.product[0] && !this.product[0].status) {
          this.product[0].status = 'available';
        }
        
       this.createImageObject()
      this.productSpecification =this.createKeyValue(this.product[0].product_specification)
      this.setUnitQuantity = '12'
      
      // Initialize video sources if available in product data
      if (this.product && this.product[0] && this.product[0].video_url) {
        this.initializeVideoSources(this.product[0].video_url);
      }
      if (this.product && this.product[0] && this.product[0].video_url) {
        this.videoPoster = this.constructImageUrl(this.product[0].video_url);
      }
      }else{
        this.product = undefined
      }
      
      } catch (err) {
        console.error('There was a problem with the fetch operation:', err);

      }
      
    }
  }


  set setUnitQuantity(quantity: string){
    if(this.product[0]?.name =="Sakura Pro Collagen Drink") {
      this.unitName='Bottles'
      this.unitQuantity= quantity
    }
  }



  toggle() {
    this.expanded = !this.expanded;
  }
  createKeyValue (data:Array<string>){
    const result = [];

    if (data){
      for (const item of data) {
        if(item.includes(':')){
          const parts = item.split(': ');
          if (parts.length === 2) {
          const key = parts[0].trim();
          const value = parts[1].trim();
          result.push({
            key,
            value
          });
          }
        } else if(!item.includes(':')) {
          result.push({
            key:item,
            value:''

        });
        }
      }
    }
  return result;
  }

  createImageObject():void{
    for (let i = 0; i < this.product[0].image.length; i += 2) {
      const thumbnailImageSrc = this.product[0].image[i];
      const itemImageSrc = this.product[0].image[i + 1];
  
      this.imageObject.push({
          itemImageSrc: itemImageSrc,
          thumbnailImageSrc: thumbnailImageSrc,
          alt: null,
          title: null
      });
    }
  }

  closeModal() {
    this.modalVisible = false
  }

  /**
   * Opens WhatsApp for product inquiry
   */
  openWhatsApp(): void {
    if (this.product && this.product[0]) {
      const productName = this.product[0].name;
      const productPrice = this.getFormattedPrice();
      this.whatsappService.openProductInquiry(productName, productPrice);
    } else {
      this.whatsappService.openWhatsApp('product');
    }
  }

  /**
   * Opens WhatsApp for single product purchase (special offer)
   */
  openWhatsAppSingleProduct(): void {
    if (this.product && this.product[0]) {
      const productName = this.product[0].name;
      const price = this.getSingleProductTotal();
      this.whatsappService.openProductSinglePurchase(productName, price);
    } else {
      this.whatsappService.openWhatsApp('product');
    }
  }

  /**
   * Opens WhatsApp for two products purchase (best value offer)
   */
  openWhatsAppTwoProducts(): void {
    if (this.product && this.product[0]) {
      const productName = this.product[0].name;
      const total = this.getTwoProductTotal();
      this.whatsappService.openProductTwoPurchase(productName, total);
    } else {
      this.whatsappService.openWhatsApp('product');
    }
  }


  hasPromo(){
   return this.product && this.product[0] && this.product[0].promo_price ? true : false;
  }

  /**
   * Formats a price number to always show 2 decimal places with RM prefix
   * @param price - The price value (number or string)
   * @returns Formatted price string (e.g., "RM120.00", "RM15.50")
   */
  formatPrice(price: number | string | undefined | null): string {
    if (price === undefined || price === null || price === '') {
      return 'RM0.00';
    }
    const numPrice = typeof price === 'string' ? parseFloat(price.trim()) : price;
    if (isNaN(numPrice) || numPrice < 0) {
      return 'RM0.00';
    }
    return `RM${numPrice.toFixed(2)}`;
  }

  /**
   * Gets the formatted single product price per unit
   */
  getSingleProductPrice(): string {
    if (!this.product || !this.product[0]) {
      return 'RM0.00';
    }
    return this.formatPrice(this.product[0].price);
  }

  /**
   * Gets the formatted total for single product purchase
   */
  getSingleProductTotal(): string {
    if (!this.product || !this.product[0]) {
      return 'RM0.00';
    }
    return this.formatPrice(this.product[0].price);
  }

  /**
   * Gets the formatted promo price per unit for two products
   */
  getTwoProductPricePerUnit(): string {
    if (!this.product || !this.product[0] || !this.product[0].promo_price) {
      return 'RM0.00';
    }
    return this.formatPrice(this.product[0].promo_price);
  }

  /**
   * Gets the formatted total for two products (promo price * 2)
   */
  getTwoProductTotal(): string {
    if (!this.product || !this.product[0] || !this.product[0].promo_price) {
      return 'RM0.00';
    }
    const total = this.product[0].promo_price * 2;
    return this.formatPrice(total);
  }

  /**
   * Gets the formatted original total for two products (regular price * 2)
   */
  getTwoProductOriginalTotal(): string {
    if (!this.product || !this.product[0]) {
      return 'RM0.00';
    }
    const total = this.product[0].price * 2;
    return this.formatPrice(total);
  }

  /**
   * Gets the formatted savings amount (original total - promo total)
   */
  getSavingsAmount(): string {
    if (!this.product || !this.product[0] || !this.product[0].promo_price) {
      return 'RM0.00';
    }
    const originalTotal = this.product[0].price * 2;
    const promoTotal = this.product[0].promo_price * 2;
    const savings = originalTotal - promoTotal;
    return this.formatPrice(savings);
  }

  /**
   * Gets the formatted regular price for non-promo products
   */
  getFormattedPrice(): string {
    if (!this.product || !this.product[0]) {
      return 'RM0.00';
    }
    return this.formatPrice(this.product[0].price);
  }

  /**
   * Gets the appropriate button text based on product status
   */
  getButtonText(): string {
    if (!this.product || !this.product[0]) {
      return 'Buy Now';
    }

    switch (this.product[0].status) {
      case 'out-of-stock':
        return 'Out of Stock';
      case 'coming-soon':
        return 'Coming Soon';
      case 'sale':
        return 'Buy Now - Sale!';
      default:
        return 'Buy Now';
    }
  }

  /**
   * Initializes video sources from product video data
   * Supports both full URLs and relative paths (which will be converted to full Supabase URLs)
   */
  private initializeVideoSources(videoData: any): void {
    const supabaseBaseUrl = 'https://cdotngdpjgeeybbfdoit.supabase.co/storage/v1/object/public/nvc';
    
    const constructVideoUrl = (pathOrUrl: string): string => {
      // If it's already a full URL, return as is
      if (pathOrUrl.startsWith('http://') || pathOrUrl.startsWith('https://')) {
        return pathOrUrl;
      }
      // Otherwise, construct the full Supabase URL
      // Remove leading slash if present
      const cleanPath = pathOrUrl.startsWith('/') ? pathOrUrl.slice(1) : pathOrUrl;
      return `${supabaseBaseUrl}/${cleanPath}`;
    };

    const getVideoType = (url: string): string => {
      if (url.endsWith('.webm')) return 'video/webm';
      if (url.endsWith('.mp4')) return 'video/mp4';
      if (url.endsWith('.ogg')) return 'video/ogg';
      return 'video/mp4'; // default
    };

    if (Array.isArray(videoData)) {
      this.videoSources = videoData.map((video: any) => {
        const src = typeof video === 'string' ? video : video.src;
        const fullUrl = constructVideoUrl(src);
        return {
          src: fullUrl,
          type: typeof video === 'string' ? getVideoType(fullUrl) : (video.type || getVideoType(fullUrl)),
        };
      });
    } else if (typeof videoData === 'string') {
      const fullUrl = constructVideoUrl(videoData);
      this.videoSources = [{
        src: fullUrl,
        type: getVideoType(fullUrl),
      }];
    }
  }

  /**
   * Constructs full URL for images/posters from path or returns full URL as-is
   */
  private constructImageUrl(pathOrUrl: string): string {
    // If it's already a full URL, return as is
    if (pathOrUrl.startsWith('http://') || pathOrUrl.startsWith('https://')) {
      return pathOrUrl;
    }
    // Otherwise, construct the full Supabase URL
    const supabaseBaseUrl = 'https://cdotngdpjgeeybbfdoit.supabase.co/storage/v1/object/public/nvc';
    const cleanPath = pathOrUrl.startsWith('/') ? pathOrUrl.slice(1) : pathOrUrl;
    return `${supabaseBaseUrl}/${cleanPath}`;
  }

  /**
   * Checks if video sources are available
   */
  hasVideo(): boolean {
    return this.videoSources && this.videoSources.length > 0;
  }

  /**
   * Checks if the current product is Ancestral Keto Diet Guide
   */
  isAncestralKetoProduct(): boolean {
    return this.product && this.product[0] && this.product[0].name === 'Ancestral Keto Diet Guide';
  }

  /**
   * FAQ data for Ancestral Keto Diet Guide
   */
  ancestralKetoFaq = [
    {
      "title": "ProductDetail.FAQ.question_1.question",
      "content": "ProductDetail.FAQ.question_1.answer",
      "value": "0",
      "isOpen": false
    },
    {
      "title": "ProductDetail.FAQ.question_2.question",
      "content": "ProductDetail.FAQ.question_2.answer",
      "value": "1",
      "isOpen": false
    },
    {
      "title": "ProductDetail.FAQ.question_3.question",
      "content": "ProductDetail.FAQ.question_3.answer",
      "value": "2",
      "isOpen": false
    },
    {
      "title": "ProductDetail.FAQ.question_4.question",
      "content": "ProductDetail.FAQ.question_4.answer",
      "value": "3",
      "isOpen": false
    },
    {
      "title": "ProductDetail.FAQ.question_5.question",
      "content": "ProductDetail.FAQ.question_5.answer",
      "value": "4",
      "isOpen": false
    },
    {
      "title": "ProductDetail.FAQ.question_6.question",
      "content": "ProductDetail.FAQ.question_6.answer",
      "value": "5",
      "isOpen": false
    },
    {
      "title": "ProductDetail.FAQ.question_7.question",
      "content": "ProductDetail.FAQ.question_7.answer",
      "value": "6",
      "isOpen": false
    },
    {
      "title": "ProductDetail.FAQ.question_8.question",
      "content": "ProductDetail.FAQ.question_8.answer",
      "value": "7",
      "isOpen": false
    },
    {
      "title": "ProductDetail.FAQ.question_9.question",
      "content": "ProductDetail.FAQ.question_9.answer",
      "value": "8",
      "isOpen": false
    },
    {
      "title": "ProductDetail.FAQ.question_10.question",
      "content": "ProductDetail.FAQ.question_10.answer",
      "value": "9",
      "isOpen": false
    },
    {
      "title": "ProductDetail.FAQ.question_11.question",
      "content": "ProductDetail.FAQ.question_11.answer",
      "value": "10",
      "isOpen": false
    },
    {
      "title": "ProductDetail.FAQ.question_12.question",
      "content": "ProductDetail.FAQ.question_12.answer",
      "value": "11",
      "isOpen": false
    },
    {
      "title": "ProductDetail.FAQ.question_13.question",
      "content": "ProductDetail.FAQ.question_13.answer",
      "value": "12",
      "isOpen": false
    },
    {
      "title": "ProductDetail.FAQ.question_14.question",
      "content": "ProductDetail.FAQ.question_14.answer",
      "value": "13",
      "isOpen": false
    },
    {
      "title": "ProductDetail.FAQ.question_15.question",
      "content": "ProductDetail.FAQ.question_15.answer",
      "value": "14",
      "isOpen": false
    }
  ];

  toggleFaqAccordion(index: number): void {
    this.ancestralKetoFaq[index].isOpen = !this.ancestralKetoFaq[index].isOpen;
  }
}
