import { Component, OnInit, model, ViewChild, ElementRef, PLATFORM_ID, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { RequestService } from '../../services/requestService.service';
import {FormsModule} from '@angular/forms'
import { FlickityCarouselComponent } from '../../widgets/flickity-carousel/flickity-carousel.component';
import { productImage } from '../../core/model/product.model';
import { CartService } from '../../services/cartService.service';
import { WhatsAppService } from '../../services/whatsapp.service';
import { environment } from '../../../environments/environment';
import { ProductService } from '../../services/productService.service';


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
  // product: any = undefined
  product: any = { 0: { name: '', price: '', description_1: '', description_2: '', status: 'sale' } };
  // Form model for template-driven form
  nutrients:any
  quantity:number = 1

  Math = Math;

  imageObject: productImage[] = []

  baseUrl:string = environment.apiHost

  productSpecification:any

  nutrientsTableImage: any

  constructor(
    private activatedRoute: ActivatedRoute, 
    private requestService:RequestService, 
    private cartService:CartService,
    private whatsappService: WhatsAppService,
    private productService: ProductService 
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
        this.getNutrientTableData()
        this.nutrientsTableImage = this.product[0].name + '.png'
        // Set default status if not provided
        if (this.product && this.product[0] && !this.product[0].status) {
          this.product[0].status = 'available';
        }
        
        // Demo: Uncomment one of these lines to test different statuses
        // this.product[0].status = 'out-of-stock';
        // this.product[0].status = 'sale';
        // this.product[0].status = 'coming-soon';
        
        // console.log(this.product[0])
        // const response = await this.requestService.requestHelper(`/products/getProduct/${productId}`, "GET")
       this.createImageObject()
      this.productSpecification =this.createKeyValue(this.product[0].product_specification)
      }else{
        this.product = undefined
      }
      
      } catch (err) {
        console.error('There was a problem with the fetch operation:', err);

      }
      
    }
  }

  expanded = false;

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
  // console.log(this.imageObject)
  }

 
  async getNutrientTableData(){
    try{
    const response = await this.productService.getNutrientsData(this.product[0]?.id)

    if (!response.success){
      console.warn('Failed to load nutrients data:', response.result);
      return;
    }
    this.nutrients = response.result;
    console.log('Nutrients:', this.nutrients);
    }catch(error){
      console.error('Unexpected error in nutrientTable():', error);
    }
  }

  async getNutrientTableHeader(){
    
  }

  openModal(event: MouseEvent) {
    const target = event.target as HTMLImageElement;
    this.modalImage.nativeElement.src = target.src;
    this.caption.nativeElement.textContent = target.alt;
    this.modalVisible = true;
  }

  closeModal() {
    this.modalVisible = false
  }

  addToCart(form:any) {
    const response = this.cartService.addToCart(this.product?.[0].id, this.quantity)
    console.log(response)
    console.log('Adding to cart:', this.quantity);
    // Add your cart logic here
  }

  buyNow() {
    console.log('Buying now:', this.quantity);
    // Add your buy now logic here
  }

  /**
   * Opens WhatsApp for product inquiry
   */
  openWhatsApp(): void {
    if (this.product && this.product[0]) {
      const productName = this.product[0].name;
      const productPrice = this.product[0].price ? `RM${this.product[0].price}` : undefined;
      this.whatsappService.openProductInquiry(productName, productPrice);
    } else {
      this.whatsappService.openWhatsApp('product');
    }
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
