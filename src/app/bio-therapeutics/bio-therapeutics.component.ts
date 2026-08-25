import { Component, ChangeDetectionStrategy } from '@angular/core';

import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-bio-therapeutics',
  imports: [TranslatePipe],
  templateUrl: './bio-therapeutics.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './bio-therapeutics.component.scss'
})
export class BioTherapeuticsComponent {

}
