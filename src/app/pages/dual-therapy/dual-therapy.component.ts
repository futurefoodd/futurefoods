import { Component, ChangeDetectionStrategy } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-dual-therapy',
  imports: [TranslatePipe],
  templateUrl: './dual-therapy.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './dual-therapy.component.scss'
})
export class DualTherapyComponent {}
