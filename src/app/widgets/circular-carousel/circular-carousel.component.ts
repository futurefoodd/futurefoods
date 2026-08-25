import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
// import { Product } from '@/domain/product';
import { ProductService } from './productservice';
import { Carousel } from 'primeng/carousel';
import { ButtonModule } from 'primeng/button';
import { Tag } from 'primeng/tag';
import { CommonModule } from '@angular/common';


interface Product {
  id?: string;
  code?: string;
  name?: string;
  description?: string;
  price?: number;
  quantity?: number;
  inventoryStatus?: string;
  category?: string;
  image?: string;
  rating?: number;
}

@Component({
  selector: 'app-circular-carousel',
  imports: [Carousel, ButtonModule, Tag, CommonModule],
  providers: [ProductService],
  templateUrl: './circular-carousel.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './circular-carousel.component.scss'
})
export class CircularCarouselComponent {
  products: Product[] =[ {
    id: '1000',
    code: 'f230fh0g3',
    name: 'Smooth Skin & Body Repair',
    description: 'Product Description',
    image: 'image_1.png',
    price: 65,
    category: 'Accessories',
    quantity: 24,
    inventoryStatus: 'INSTOCK',
    rating: 5
},
{
    id: '1001',
    code: 'nvklal433',
    name: 'Energy Fuel Soft Pastilles',
    description: 'Product Description',
    image: 'image_2.png',
    price: 72,
    category: 'Accessories',
    quantity: 61,
    inventoryStatus: 'OUTOFSTOCK',
    rating: 4
},
{
    id: '1002',
    code: 'zz21cz3c1',
    name: 'Ready set Glow',
    description: 'Product Description',
    image: 'image_3.png',
    price: 79,
    category: 'Fitness',
    quantity: 2,
    inventoryStatus: 'LOWSTOCK',
    rating: 3
},];

  responsiveOptions: any[] | undefined;

  constructor(private productService: ProductService) {}

  ngOnInit() {
    //   this.productService.getProductsSmall().then(data => {
    //       this.products = data.slice(0, 9);
    //   });

      this.responsiveOptions = [
          {
              breakpoint: '1400px',
              numVisible: 2,
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
      ]
  }

  getSeverity(status: string) {
      switch (status) {
          case 'INSTOCK':
              return 'success';
          case 'LOWSTOCK':
              return 'warn';
          case 'OUTOFSTOCK':
              return 'danger';
      }
      return undefined;
  }
}
