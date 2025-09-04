import { Component, OnInit, model, ViewChild, ElementRef, PLATFORM_ID, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { RequestService } from '../../services/requestService.service';
import {FormsModule} from '@angular/forms'
import { FlickityCarouselComponent } from '../../widgets/flickity-carousel/flickity-carousel.component';
import { productImage } from '../../core/model/product.model';
import { CartService } from '../../services/cartService.service';


// type productImage = {
//   itemImageSrc: string | null,
//   thumbnailImageSrc: string | null,
//   alt:  string | null,
//   title:  string | null
// }

@Component({
  selector: 'app-product-detail',
  imports: [FormsModule, FlickityCarouselComponent],
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
  product: any = { 0: { name: '', price: '', description_1: '', description_2: '' } };
  // Form model for template-driven form

    quantity:number = 1
  // 

  // Make Math available in template
  Math = Math;

  imageObject: productImage[] = []

  constructor(private activatedRoute: ActivatedRoute, private requestService:RequestService, private cartService:CartService) {

  }

  async ngOnInit(): Promise<void> {
    if (isPlatformBrowser(this.platformId)) {
      try {
        const params = await firstValueFrom(this.activatedRoute.paramMap)
        const productId = params.get('id')
        
       if(productId){ 
        const response = await fetch(`http://localhost:4200/api/products/getProduct/${productId}`)
        if(!response.ok){
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const product= await response.json()
        this.product = product.result
        // console.log(this.product[0])
        // const response = await this.requestService.requestHelper(`/products/getProduct/${productId}`, "GET")
       this.createImageObject()
      //  console.log(this.imageObject)
      }else{
        this.product = undefined
      }
      } catch (err) {
        console.error('There was a problem with the fetch operation:', err);

      }
    }
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
}
