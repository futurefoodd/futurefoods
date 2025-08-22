import { Component, OnInit, model, ViewChild, ElementRef, PLATFORM_ID, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { RequestService } from '../../services/requestService.service';
import {FormsModule} from '@angular/forms'
import { FlickityCarouselComponent } from '../../widgets/flickity-carousel/flickity-carousel.component';


type productImage = {
  itemImageSrc: string | null,
  thumbnailImageSrc: string | null,
  alt:  string | null,
  title:  string | null
}

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
  product: any = undefined
  quantity: number = 0

  imageObject: Array<productImage> = [{
    itemImageSrc: null,
    thumbnailImageSrc: null,
    alt: null,
    title: null
  }]

  constructor(private activatedRoute: ActivatedRoute, private requestService:RequestService) {

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
        console.log(this.product)
        // const response = await this.requestService.requestHelper(`/products/getProduct/${productId}`, "GET")
       this.createImageObject()
       console.log(this.imageObject)
      }else{
        this.product = undefined
      }
      } catch (err) {
        console.error('There was a problem with the fetch operation:', err);

      }
    }
  }

  createImageObject():void{
    if (!this.product || !this.product[0] || !this.product[0].image) {
      console.error('Product images not found.');
      return;
    }
    
    this.product[0].image.forEach((img:any, index: number) =>{
        // console.log(img, index)
        if(img.includes(`_${index+1}.`)){
          this.imageObject[index].itemImageSrc=img
        } 
        
        if(img.includes(`_${index+1}_s.`)){
          this.imageObject[index].thumbnailImageSrc = img
        }
      })
      
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

  addToCart() {

  }
}
