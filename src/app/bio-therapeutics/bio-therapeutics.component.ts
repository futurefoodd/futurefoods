import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-bio-therapeutics',
  imports: [CommonModule, TranslatePipe],
  templateUrl: './bio-therapeutics.component.html',
  styleUrl: './bio-therapeutics.component.scss'
})
export class BioTherapeuticsComponent {

}
