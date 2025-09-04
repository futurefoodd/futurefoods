import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-top-nav',
  imports: [CommonModule, RouterModule],
  templateUrl: './top-nav.component.html',
  styleUrl: './top-nav.component.scss'
})
export class TopNavComponent {
  isMenuOpen = false;
  isDieteticsDropdownOpen = false;
  items = [
    { id: 'classroom-wellbeing', name: 'Classroom Wellbeing', price: 49.9, quantity: 1, image: 'nvc_white_cap_no_background.png' },
    { id: 'immune-support', name: 'Immune Support', price: 39.9, quantity: 2, image: 'nvc-white-cap.png' }
  ];
  // @Input() isMenuOpen2: boolean = false;
  @Output() closeMenu = new EventEmitter<void>();

  constructor(private elementRef: ElementRef) {}
  
  toggleMenu() {
    console.log('here')
    this.isMenuOpen = !this.isMenuOpen;
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
