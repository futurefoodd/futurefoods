import { Component, OnInit, model, ViewChild, ElementRef, PLATFORM_ID, inject, HostListener } from '@angular/core';
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
import * as fs from 'fs'
import * as path from 'path'


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
  
  // Image modal properties
  imageModalVisible: boolean = false;
  modalImageUrl: string = '';

  baseUrl:string = environment.apiHost

  productSpecification:any

  nutrientsTableImages: string[] = []
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

        // Get nutrients table images from product[0] array field
        // Check for common field names: nutrients_table_images, nutrients_images, nutritional_images
        const nutrientsImagesField = this.product[0].nutrients_table_images || 
                                     this.product[0].nutrients_images || 
                                     this.product[0].nutritional_images ||
                                     this.product[0].nutrients_table_image_paths;
        
        if (Array.isArray(nutrientsImagesField) && nutrientsImagesField?.length > 0) {
          // Convert paths to full Supabase URLs
          this.nutrientsTableImages = nutrientsImagesField.map((path: string) => 
            this.constructImageUrl(path)
          );
        } else {
          this.nutrientsTableImages = [];
        }
        console.log(this.nutrientsTableImages)
        if (this.product && this.product[0] && !this.product[0].status) {
          this.product[0].status = 'available';
        }
        
       this.createImageObject()
      this.productSpecification =this.createKeyValue(this.product[0].product_specification)
      this.parsePackagingType()
      
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


  /**
   * Parses the packaging_type field from API response
   * Expected format: "12 bottles" or "30 pastilles" etc.
   * Extracts quantity and unit name
   */
  parsePackagingType(): void {
    if (!this.product || !this.product[0] || !this.product[0].packaging_type) {
      // Default values if packaging_type is not available
      this.unitName = 'box';
      this.unitQuantity = '';
      return;
    }

    const packagingType = this.product[0].packaging_type.toString().trim();
    
    if (!packagingType) {
      this.unitName = 'box';
      this.unitQuantity = '';
      return;
    }

    // Parse format like "12 bottles", "30 pastilles", etc.
    // Match number followed by space and text
    const match = packagingType.match(/^(\d+)\s+(.+)$/i);
    
    if (match && match.length === 3) {
      this.unitQuantity = match[1]; // Extract quantity (e.g., "12")
      this.unitName = match[2]; // Extract unit name (e.g., "bottles")
    } else {
      // If format doesn't match expected pattern, try to extract just the unit name
      // or use the whole string as unit name
      const numberMatch = packagingType.match(/\d+/);
      if (numberMatch) {
        this.unitQuantity = numberMatch[0];
        this.unitName = packagingType.replace(numberMatch[0], '').trim() || 'box';
      } else {
        // No number found, use entire string as unit name
        this.unitName = packagingType;
        this.unitQuantity = '';
      }
    }
  }
  
  
  // hasNutrientsTableImage(){

  // }


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
    console.log(this.product[0].image)
    for (let i = 0; i < this.product[0].image.length; i += 2) {
      const  itemImageSrc= this.product[0].image[i];
      const  thumbnailImageSrc= this.product[0].image[i + 1];
  
      this.imageObject.push({
          itemImageSrc: itemImageSrc,
          thumbnailImageSrc: thumbnailImageSrc,
          alt: null,
          title: null
      });

      console.log(this.imageObject)
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
      this.whatsappService.openProductInquiry(this.product[0].name, this.product[0].price, undefined, this.product[0].pic);

    } else {
      this.whatsappService.openWhatsApp('product');
      // this.whatsappService.openProductInquiry(this.product[0].name, this.product[0].price, undefined, this.product[0].pic);
    }
  }

  /**
   * Opens WhatsApp for product inquiry with specific phone number and name
   */
  openWhatsAppWithNumber(phoneNumber: string, name: string): void {
    if (this.product && this.product[0]) {
      const productName = this.product[0].name;
      const productPrice = this.getFormattedPrice();
      const message = `Hello ${name}! I'm interested in ${productName} (${productPrice}). Can you help me with more information and how to purchase?\nhttps://futurefoods.com.my`;
      this.whatsappService.openWhatsApp('product', message, undefined, phoneNumber);
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
      const phoneNumber = this.getPhoneNumber();
      this.whatsappService.openProductSinglePurchase(productName, price, undefined, phoneNumber);
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
      const phoneNumber = this.getPhoneNumber();
      this.whatsappService.openProductTwoPurchase(productName, total, undefined, phoneNumber);
    } else {
      this.whatsappService.openWhatsApp('product');
    }
  }

  /**
   * Parses the pic field to extract phone numbers and names
   * Returns an array of objects with phone number and name
   */
  parsePicField(): Array<{phone: string, name: string}> {
    if (!this.product[0]?.pic) {
      return [];
    }
    const picValue = this.product[0].pic.toString().trim();
    if (!picValue) {
      return [];
    }

    // Phone number to name mapping
    const phoneNameMap: {[key: string]: string} = {
      '+60122942947': 'Charming Cottage (Carol)',
      '+60126964997': 'Dhanesh'
    };

    // Split by comma and clean up
    const numbers = picValue.split(',').map((num: string) => num.trim()).filter((num: string) => num);
    
    return numbers.map((phone: string) => ({
      phone: phone,
      name: phoneNameMap[phone] || phone
    }));
  }

  /**
   * Gets the first phone number from pic field, or returns default
   */
  getPhoneNumber(): string | undefined {
    const parsed = this.parsePicField();
    if (parsed.length > 0) {
      return parsed[0].phone;
    }
    return undefined; // Will use default from service
  }

  /**
   * Checks if there are multiple phone numbers in pic field
   */
  hasMultiplePhoneNumbers(): boolean {
    return this.parsePicField().length > 1;
  }

  /**
   * Opens WhatsApp for single product purchase with specific phone number and name
   */
  openWhatsAppSingleProductWithNumber(phoneNumber: string, name: string): void {
    if (this.product && this.product[0]) {
      const productName = this.product[0].name;
      const price = this.getSingleProductTotal();
      const message = `Hello ${name}! I'm interested in purchasing 1 ${productName} box (${price}). Can you help me complete my order?\nhttps://futurefoods.com.my`;
      this.whatsappService.openWhatsApp('product', message, undefined, phoneNumber);
    } else {
      this.whatsappService.openWhatsApp('product');
    }
  }

  /**
   * Opens WhatsApp for two products purchase with specific phone number and name
   */
  openWhatsAppTwoProductsWithNumber(phoneNumber: string, name: string): void {
    if (this.product && this.product[0]) {
      const productName = this.product[0].name;
      const total = this.getTwoProductTotal();
      const message = `Hello ${name}! I'm interested in purchasing 2 ${productName} boxes (${total} - Best Value Offer). Can you help me complete my order?\nhttps://futurefoods.com.my`;
      this.whatsappService.openWhatsApp('product', message, undefined, phoneNumber);
    } else {
      this.whatsappService.openWhatsApp('product');
    }
  }


  // hasPromo(){
  //  return this.product && this.product[0] && this.product[0].promo_price ? true : false;
  // }

  /**
   * Checks if the current product is a Pro Collagen product
   */
  isProCollagen(): boolean {
    if (!this.product || !this.product[0] || !this.product[0].name) {
      return false;
    }
    const productID = this.product[0].id;
    return productID ==='fa07877b-6016-4d09-88d9-4ab000619e62';
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
   * Gets the formatted promo price
   */
  getFormattedPromoPrice(): string {
    if (!this.product || !this.product[0] || !this.product[0].promo_price) {
      return 'RM0.00';
    }
    return this.formatPrice(this.product[0].promo_price);
  }

  /**
   * Checks if promo price is available
   */
  hasPromoPrice(): boolean {
    return this.product && this.product[0] && this.product[0].promo_price !== undefined && this.product[0].promo_price !== null;
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
    const supabaseBaseUrl = 'https://cdotngdpjgeeybbfdoit.supabase.co/storage/v1/object/public/nvc/public/videos/';
    // https://cdotngdpjgeeybbfdoit.supabase.co/storage/v1/object/public/nvc/public/videos/ancestral_video.mp4
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
    if (!pathOrUrl) {
      return '';
    }
    
    // If it's already a full URL with protocol, return as is
    if (pathOrUrl.startsWith('http://') || pathOrUrl.startsWith('https://')) {
      return pathOrUrl;
    }
    
    // If it starts with the domain but missing protocol, add https://
    if (pathOrUrl.startsWith('cdotngdpjgeeybbfdoit.supabase.co')) {
      return `https://${pathOrUrl}`;
    }
    
    // Otherwise, construct the full Supabase URL
    // https://cdotngdpjgeeybbfdoit.supabase.co/storage/v1/object/public/nvc/public/sakura/nutrients_1.png
    const supabaseBaseUrl = 'https://cdotngdpjgeeybbfdoit.supabase.co/storage/v1/object/public/nvc/public';
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
   * Checks if the current product is 21 Days Vegan Keto Meal
   */
  is21DaysKetoProduct(): boolean {
    return this.product && this.product[0] && (
      this.product[0].name === '21‑Days Vegan Keto Meal' || 
      this.product[0].name === '21 Days Vegan Keto Meal' ||
      this.product[0].id === '2242791e-fa44-4e02-a973-272ad58c2165'
    );
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

  /**
   * Opens the image modal with the clicked image
   */
  openImageModal(imageSrc: string): void {
    this.modalImageUrl = imageSrc;
    this.imageModalVisible = true;
    // Prevent body scroll when modal is open
    if (isPlatformBrowser(this.platformId)) {
      document.body.style.overflow = 'hidden';
    }
  }

  /**
   * Closes the image modal
   */
  closeImageModal(): void {
    this.imageModalVisible = false;
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
    if (this.imageModalVisible) {
      this.closeImageModal();
    }
  }
}
