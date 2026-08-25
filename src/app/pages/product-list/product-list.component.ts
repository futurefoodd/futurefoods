import { Component, inject, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { UUID } from 'crypto';
import { RequestService } from '../../services/requestService.service';
import { ScrollService } from '../../services/scroll.service';
import { environment } from '../../../environments/environment';
import { TranslatePipe } from '@ngx-translate/core';


type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
};

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [RouterModule, TranslatePipe],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})
export class ProductListComponent implements OnInit {
  isMenuOpen = false;
  rating = 5;
  baseUrl: string = environment.apiHost
  apiURL = `${this.baseUrl}/products/getAllProducts`

  // environment: any
  products:any
  
  // Affiliate link for bundle product - update with your actual affiliate URL
  affiliateLink: string = 'https://example.com/affiliate-link'; // TODO: Update with actual affiliate URL

  ngOnInit(){
    this.getAllProducts()
  }

  constructor(
    private requestService:RequestService, 
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: object,
    private scrollService: ScrollService
  ){

  }

  async navigateProductDetail(id: UUID){
// console.log(this.route)
    try{
      await this.router.navigate(['product-detail', id]);
      
      // Scroll to top after navigation with smooth behavior
      // this.scrollService.scrollToTop();
      if (isPlatformBrowser(this.platformId)) {
        window.scrollTo(0, 0);
      }

      // const response = await this.requestService.requestHelper(`/getProduct/${id}`, "GET")
      // if(!response.ok){
      //   throw new Error(`HTTP error! Status: ${response.status}`);
      // }
      // const data = await response.json();
    }catch(err){
      console.error('There was a problem navigating to product-detail/:id:', err);
    }
  }
  async getAllProducts(){
    

    try{

      const response = await fetch(this.apiURL)
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

    const data = await response.json();
    this.products = data.result
    

    // console.log('data:',data);

    } catch(err){
      console.error('There was a problem with the fetch operation:', err);
    }
    
  }
  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  openAffiliateLink(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.open(this.affiliateLink, '_blank', 'noopener,noreferrer');
    }
  }
}


