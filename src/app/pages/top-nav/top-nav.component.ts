
import { Component, ElementRef, EventEmitter, HostListener, Input, Output, ChangeDetectionStrategy } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { inject } from '@angular/core';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';


@Component({
  selector: 'app-top-nav',
  imports: [RouterModule, TranslatePipe],
  templateUrl: './top-nav.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './top-nav.component.scss'
})
export class TopNavComponent {
  isMenuOpen = false;
  isDieteticsDropdownOpen = false;
  isDieteticsExpanded = false;
  currentBreadcrumb: string[] = [];
  showBreadcrumb = false;
  items = [
    { id: 'classroom-wellbeing', name: 'Classroom Wellbeing', price: 49.9, quantity: 1, image: 'nvc_white_cap_no_background.png' },
    { id: 'immune-support', name: 'Immune Support', price: 39.9, quantity: 2, image: 'nvc-white-cap.png' }
  ];
  // @Input() isMenuOpen2: boolean = false;
  @Output() closeMenu = new EventEmitter<void>();

  private translate = inject(TranslateService);
  private router = inject(Router);

  useLanguage(language: string): void {
      this.translate.use(language);
  }

  constructor(private elementRef: ElementRef) {}
  
  toggleMenu() {
    console.log('here')
    this.isMenuOpen = !this.isMenuOpen;
    // Reset accordion state when menu closes
    if (!this.isMenuOpen) {
      this.isDieteticsExpanded = false;
      this.showBreadcrumb = false;
      this.currentBreadcrumb = [];
    }
  }

  toggleDieteticsAccordion() {
    this.isDieteticsExpanded = !this.isDieteticsExpanded;
    if (this.isDieteticsExpanded) {
      this.currentBreadcrumb = [this.translate.instant('Top-nav.home'), this.translate.instant('Top-nav.dietetics')];
      this.showBreadcrumb = true;
    } else {
      this.showBreadcrumb = false;
      this.currentBreadcrumb = [];
    }
  }

  navigateToSubItem(route: string, translationKey: string) {
    // Get translated label
    const translatedLabel = this.translate.instant(translationKey);
    // Update breadcrumb
    this.currentBreadcrumb = [this.translate.instant('Top-nav.home'), this.translate.instant('Top-nav.dietetics'), translatedLabel];
    // Navigate and close menu
    this.router.navigate([route]).then(() => {
      this.isMenuOpen = false;
      this.isDieteticsExpanded = false;
      this.showBreadcrumb = false;
      this.currentBreadcrumb = [];
    });
  }

  goBack() {
    this.isDieteticsExpanded = false;
    this.showBreadcrumb = false;
    this.currentBreadcrumb = [];
  }

  showDieteticsDropdown() {
    this.isDieteticsDropdownOpen = true;
  }

  hideDieteticsDropdown() {
    this.isDieteticsDropdownOpen = false;
  }

  @HostListener('document:click', ['$event'])
  clickout(event: Event) {
    if (this.isMenuOpen && !this.elementRef.nativeElement.contains(event.target)) {
      this.isMenuOpen = false
    }
  }
}
