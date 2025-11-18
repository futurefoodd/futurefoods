import { Component, OnInit, model, ViewChild, ElementRef, PLATFORM_ID, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import {FormsModule} from '@angular/forms'
import { FlickityCarouselComponent } from '../../widgets/flickity-carousel/flickity-carousel.component';
import { productImage } from '../../core/model/product.model';
import { WhatsAppService } from '../../services/whatsapp.service';
import { environment } from '../../../environments/environment';


// type productImage = {
//   itemImageSrc: string | null,
//   thumbnailImageSrc: string | null,
//   alt:  string | null,
//   title:  string | null
// }

@Component({
  selector: 'app-product-detail',
  imports: [CommonModule, FormsModule, FlickityCarouselComponent],
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

  constructor(
    private activatedRoute: ActivatedRoute, 
    private whatsappService: WhatsAppService
  ) {

  }

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
      const message = `Hello! I'm interested in purchasing 1 ${productName} box (${price}). Can you help me complete my order?`;
      this.whatsappService.openWhatsApp('product', message);
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
      const message = `Hello! I'm interested in purchasing 2 ${productName} boxes (${total} - Best Value Offer). Can you help me complete my order?`;
      this.whatsappService.openWhatsApp('product', message);
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
}
