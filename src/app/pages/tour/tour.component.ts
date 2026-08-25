import { Component, ChangeDetectionStrategy } from '@angular/core';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-tour',
  imports: [TranslatePipe],
  templateUrl: './tour.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './tour.component.scss'
})
export class TourComponent {

}
