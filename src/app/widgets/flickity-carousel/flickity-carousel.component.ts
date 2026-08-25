import { isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Inject, Input, Output, EventEmitter, PLATFORM_ID, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
// import { PhotoService } from '@/service/photoservice';
import { GalleriaModule } from 'primeng/galleria';
import { productImage } from '../../core/model/product.model';

@Component({
  selector: 'app-flickity-carousel',
  imports: [GalleriaModule, FormsModule],
  templateUrl: './flickity-carousel.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './flickity-carousel.component.scss'
})
export class FlickityCarouselComponent  {
    // @Input() items: Array<any> = []
  position: 'left' | 'right' | 'top' | 'bottom' = 'bottom';
  @Input() item: productImage[] = [];
  @Output() imageClick = new EventEmitter<string>();

  onImageClick(imageSrc: string): void {
    this.imageClick.emit(imageSrc);
  }

  positionOptions = [
    {
        label: 'Bottom',
        value: 'bottom'
    },
    {
        label: 'Top',
        value: 'top'
    },
    {
        label: 'Left',
        value: 'left'
    },
    {
        label: 'Right',
        value: 'right'
    }
];

responsiveOptions: any[] = [
    {
        breakpoint: '1300px',
        numVisible: 4,
    },
    {
        breakpoint: '575px',
        numVisible: 1,
    },
];
}
