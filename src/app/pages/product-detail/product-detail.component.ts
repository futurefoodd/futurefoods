import { Component, OnInit, model, ViewChild, ElementRef, PLATFORM_ID, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { RequestService } from '../../services/requestService.service';


@Component({
  selector: 'app-product-detail',
  imports: [],
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
       

      }else{
        this.product = undefined
      }
  
      } catch (err) {
        console.error('There was a problem with the fetch operation:', err);


      }
    }
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
