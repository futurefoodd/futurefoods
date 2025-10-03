import { Component } from '@angular/core';

@Component({
  selector: 'app-faq',
  imports: [],
  templateUrl: './faq.component.html',
  styleUrl: './faq.component.scss'
})
export class FaqComponent {
  tabs = [
    {
      "title": "Are our products Halal?",
      "content": "Yes, each ingredient has its Halal certificate and OEM Halal certification for the production process. ",
      "value": "0",
      "isOpen": false
    },
    {
      "title": "What is Pro-Collagen in soft-pastilles?",
      "content": "A tasty fruit-based soft pastille made with an organic blend of plant nutrients and halal gelatine that supports collagen synthesis. Soft pastilles are a source of plant-based Ascorbate (Vitamin C) antioxidants and anti-inflammatory compounds to help your body and mind stay active.",
      "value": "1",
      "isOpen": false
    },
    {
      "title": "How do these soft-pastilles help my sensitive / ageing skin?",
      "content": "These nutrient-rich soft-pastilles contain natural amino acids, glycoproteins, polypeptides, and ascorbate (dietary vitamin-c) to reduce skin sensitivity, strengthen joints and nails, and support muscle recovery. These soft-pastilles promote natural collagen and elastin production, helping your skin feel firmer with a healthier glow.",
      "value": "2",
      "isOpen": false
    },
    {
      "title": "What is Paleo-Prebiotics®?",
      "content": "It’s a unique blend of ancient soluble plant fibres and resistant starches that feed your gut’s good bacteria, improving digestion, nutrient absorption, and easing bowel movement.",
      "value": "3",
      "isOpen": false
    },
    {
      "title": "Why are MCTs included?",
      "content": "MCT C8 & C10 (from virgin coconut oil) combined with ALA=Omega 3 are energy lipids that quickly refuel your body and brain, keeping you active and refreshed.",
      "value": "4",
      "isOpen": false
    },
    {
      "title": "How should I take these soft-pastilles?",
      "content": "Place a soft-pastille twice or thrice daily under your tongue for faster absorption, or as advised by your doctor, counsellor, pharmacist, or nutritionist.",
      "value": "5",
      "isOpen": false
    },
    {
      "title": "Are these soft-pastilles safe for everyday use?",
      "content": "Yes! They are made without any artificial colours, sweeteners, preservatives, or hidden additives. These soft pastilles use Low GI Nipa Fructans from Sarawak’s Gula Apong.",
      "value": "6",
      "isOpen": false
    },
    {
      "title": "What do these soft-pastilles taste like?",
      "content": "They have a naturally fruity taste from organic ingredients such as roselle, plantain, gooseberry, and soursop, making them enjoyable to take by children, active adults, and older adults.",
      "value": "7",
      "isOpen": false
    },
    {
      "title": "Can these soft-pastilles help with ageing discomforts and keep up with daily demands?",
      "content": "Yes! The unique blend of natural Vitamin C, amino acids, glycoproteins, polyphenols, and ALA-Omega 3 works together (nutrient synergy) to support muscle recovery, strengthen skin and nails, and improve joint comfort and flexibility; helping you feel alert and ready for daily activity.",
      "value": "8",
      "isOpen": false
    },
    {
      "title": "Are these soft-pastilles suitable for women’s wellness?",
      "content": "Yes! These soft pastilles are specially crafted to support women’s wellness; helping boost energy and mood, enhance skin hydration, promote hormonal balance, and nurture overall vitality for a beautiful you.",
      "value": "9",
      "isOpen": false
    },
    {
      "title": "How should I store the product?",
      "content": "Keep the box at or below 28°C, away from sunlight and moisture to maintain freshness.",
      "value": "10",
      "isOpen": false
    },
    {
      "title": "Where are these soft-pastilles made?",
      "content": "They are professionally formulated and produced in Malaysia by Utara Dietetics & Plant-Based Research in partnership with a HACCP and Halal certified OEM manufacturer.",
      "value": "11",
      "isOpen": false
    },
    {
      "title": "Does this soft-pastille have a five-star product rating?",
      "content": "Yes! Independent customer reviews and patient feedback to doctors consistently rate our soft pastilles at five stars, reflecting high satisfaction in areas such as taste, effectiveness, overall wellness support, and value for money.",
      "value": "12",
      "isOpen": false
    }
  ]

  toggleAccordion(index: number): void {
    this.tabs[index].isOpen = !this.tabs[index].isOpen;
  }
}
