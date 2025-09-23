import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NutritionConsultService } from '../../services/consult.service';

@Component({
  selector: 'app-dietetics',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './dietetics.component.html',
  styleUrl: './dietetics.component.scss'
})
export class DieteticsComponent {
  consultForm: FormGroup;

  // options
  alcohol = ['Beer', 'Wine','Liquor']
  snacks = ['Cofee', 'Tea','Suagry Drinks', 'Snacks']
  exerciseOptions = ['Brisk Walk', 'Yoga', 'Gym Workout', 'Swimming', 'Hiking'];
  jobOptions = ['Night Shift', 'Cleaning Services', 'Frequent Deadlines', 'Engine Services/Construstion Works'];
  dietPatterns = [
    'One meal per day (OMAD)',
    'Weekly Intermittent Fasting',
    'Meals after 8pm',
    'Meals with bigger portion of carbs'
  ];
  eatingStyles = ['Vegetarian', 'Vegan', 'Omnivore', 'Keto', 'Fast Food'];
  primaryGoals = ['Weight loss', 'Gut health & Regular Bowel Movement', 'Energy boost'];
  secondaryGoals = ['Muscle gain', 'Joint Comfort', 'Skin health', 'Women’s wellness'];
  concerns = ['Bloating', 'Reflux', 'Constipation', 'Hormonal Issues', 'Knee & Back Ache', 'Stress & Cramps'];
  familyHistoryOptions = ['Diabetes', 'Hypertension', 'Heart Disease', 'IBS / IBD', 'Anaemia'];

  constructor(private fb: FormBuilder, private consultFormService: NutritionConsultService) {
    this.consultForm = this.fb.group({
      name: ['', Validators.required],
      age: ['', Validators.required],
      sex: ['', Validators.required],
      height: ['', Validators.required],
      weight: ['', Validators.required],
      country: ['', Validators.required],
      activityLevel: ['', Validators.required],
      exerciseRoutine: [[], Validators.required],
      exerciseFrequency: ['', Validators.required],
      jobDemands: [[], Validators.required],
      sleepHours: ['', Validators.required],
      smokingVaping: ['', Validators.required],
      alcoholGroup: this.fb.group({
        types: [[], Validators.required],              // checkbox selections
        consumption: ['', Validators.required],        // radio choice
      }),
      dietaryPatterns: [[], Validators.required],
      eatingStyle: [[], Validators.required],
      waterIntake: ['', Validators.required],
      snackFrequency: ['', Validators.required],
      snackGroup: this.fb.group({
        types: [[], Validators.required],              // checkbox selections
        frequency: ['', Validators.required],        // radio choice
      }),
      primaryGoal: ['', Validators.required],
      secondaryGoals: [[], Validators.required],
      specificConcerns: [[], Validators.required],
      supplements: [''],
      familyHistory: [[], Validators.required],
      recentHospitalisation: [false, Validators.required],
      yearlyScreening: [false, Validators.required],
      foodAllergy: [false, Validators.required],
      medication: [false, Validators.required],
      recentTravel: [false, Validators.required],
    });
  }

  // handle checkbox changes
  onCheckboxChange(event: any, field: string) {
    const selected = this.consultForm.get(field)?.value || [];
    if (event.target.checked) {
      selected.push(event.target.value);
    } else {
      const index = selected.indexOf(event.target.value);
      if (index >= 0) selected.splice(index, 1);
    }
    this.consultForm.get(field)?.setValue(selected);
  }

  async onSubmit() {
    if(this.consultForm.valid){
      const submitConsultation = await this.consultFormService.submitConsultForm(this.consultForm.value)
      console.log(submitConsultation)
      console.log(this.consultForm.value);
      alert('Form submitted!');
    } else {
      console.log(this.consultForm.value);
      // alert('Please fill up the mandatory fields!')
    }
  }

}
