import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NutritionConsultService } from '../../services/consult.service';
import { DetailedConsultService } from '../../services/detailed-consult.service';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-dietetics',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, TranslatePipe],
  templateUrl: './dietetics.component.html',
  styleUrl: './dietetics.component.scss'
})
export class DieteticsComponent {
  consultForm: FormGroup;
  detailedForm: FormGroup;
  sampleRequestForm: FormGroup;
  activeTab: 'basic' | 'detailed' | 'sample' = 'basic';
  syncBasicInfo: boolean = false;

  // options
  alcohol = ['Dietetics.options.beer', 'Dietetics.options.wine','Dietetics.options.liquor', 'Dietetics.options.none']
  snacks = ['Dietetics.options.coffee', 'Dietetics.options.tea','Dietetics.options.sugaryDrinks', 'Dietetics.options.snacks']
  exerciseOptions = ['Dietetics.options.briskWalk', 'Dietetics.options.yoga', 'Dietetics.options.gymWorkout', 'Dietetics.options.swimming', 'Dietetics.options.hiking', 'Dietetics.options.none'];
  jobOptions = ['Dietetics.options.nightShift', 'Dietetics.options.cleaningServices', 'Dietetics.options.frequentDeadlines', 'Dietetics.options.engineServices', 'Dietetics.options.na'];
  referredByOptions = [
    'Dietetics.options.agent',
    'Dietetics.options.doctor'
  ];
  dietPatterns = [
    'Dietetics.options.omad',
    'Dietetics.options.weeklyFasting',
    'Dietetics.options.mealsAfter8pm',
    'Dietetics.options.biggerCarbs'
  ];
  eatingStyles = ['Dietetics.options.vegetarian', 'Dietetics.options.vegan', 'Dietetics.options.omnivore', 'Dietetics.options.keto', 'Dietetics.options.fastFood'];
  primaryGoals = ['Dietetics.options.weightLoss', 'Dietetics.options.gutHealth', 'Dietetics.options.energyBoost'];
  secondaryGoals = ['Dietetics.options.muscleGain', 'Dietetics.options.jointComfort', 'Dietetics.options.skinHealth', 'Dietetics.options.womensWellness'];
  concerns = ['Dietetics.options.bloating', 'Dietetics.options.reflux', 'Dietetics.options.constipation', 'Dietetics.options.hormonalIssues', 'Dietetics.options.kneeBackAche', 'Dietetics.options.stressCramps'];
  familyHistoryOptions = ['Dietetics.options.diabetes', 'Dietetics.options.hypertension', 'Dietetics.options.heartDisease', 'Dietetics.options.ibsIbd', 'Dietetics.options.anaemia'];

  // Detailed form options
  breakfastOptions = [
    'Dietetics.detailedForm.options.breakfastToast',
    'Dietetics.detailedForm.options.breakfastHam',
    'Dietetics.detailedForm.options.breakfastPancakes',
    'Dietetics.detailedForm.options.breakfastProtein',
    'Dietetics.detailedForm.options.breakfastFruits',
    'Dietetics.detailedForm.options.breakfastCoffee',
    'Dietetics.detailedForm.options.breakfastNoodles'
  ];
  lunchOptions = [
    'Dietetics.detailedForm.options.lunchCarbs',
    'Dietetics.detailedForm.options.lunchTubers',
    'Dietetics.detailedForm.options.lunchNasiKandar',
    'Dietetics.detailedForm.options.lunchProtein',
    'Dietetics.detailedForm.options.lunchSoups'
  ];
  dinnerTimeOptions = [
    'Dietetics.detailedForm.options.dinnerTimeEarly',
    'Dietetics.detailedForm.options.dinnerTimeBefore8',
    'Dietetics.detailedForm.options.dinnerTimeAfter8',
    'Dietetics.detailedForm.options.dinnerTimeSkip'
  ];
  dinnerOptions = [
    'Dietetics.detailedForm.options.dinnerCarbs',
    'Dietetics.detailedForm.options.dinnerVege',
    'Dietetics.detailedForm.options.dinnerSeafood',
    'Dietetics.detailedForm.options.dinnerBread',
    'Dietetics.detailedForm.options.dinnerProtein',
    'Dietetics.detailedForm.options.dinnerSalads'
  ];
  waterBeveragesOptions = [
    'Dietetics.detailedForm.options.waterMore5',
    'Dietetics.detailedForm.options.waterBeverages3',
    'Dietetics.detailedForm.options.waterAlkaline'
  ];
  lowEnergyOptions = [
    'Dietetics.detailedForm.options.energyMorning',
    'Dietetics.detailedForm.options.energyAfter5',
    'Dietetics.detailedForm.options.energySleepy',
    'Dietetics.detailedForm.options.energySleep'
  ];
  constipationOptions = [
    'Dietetics.detailedForm.options.constipationDaily',
    'Dietetics.detailedForm.options.constipationThrice',
    'Dietetics.detailedForm.options.constipationSudden'
  ];
  cookingOilOptions = [
    'Dietetics.detailedForm.options.oilCoconut',
    'Dietetics.detailedForm.options.oilCanola'
  ];
  milkConsumptionOptions = [
    'Dietetics.detailedForm.options.milkCoffee',
    'Dietetics.detailedForm.options.milkCreamer',
    'Dietetics.detailedForm.options.milk3in1',
    'Dietetics.detailedForm.options.milkBed'
  ];
  hungerAfterBreakfastOptions = [
    'Dietetics.detailedForm.options.hungerLess4',
    'Dietetics.detailedForm.options.hunger7to8',
    'Dietetics.detailedForm.options.hungerCoffee'
  ];
  painDiscomfortOptions = [
    'Dietetics.detailedForm.options.painJoints',
    'Dietetics.detailedForm.options.painNeck',
    'Dietetics.detailedForm.options.painLimbs',
    'Dietetics.detailedForm.options.painBack',
    'Dietetics.detailedForm.options.painRib'
  ];
  symptomsOptions = [
    'Dietetics.detailedForm.options.symptomBelly',
    'Dietetics.detailedForm.options.symptomMotion',
    'Dietetics.detailedForm.options.symptomConstipation',
    'Dietetics.detailedForm.options.symptomHeartburn',
    'Dietetics.detailedForm.options.symptomNausea',
    'Dietetics.detailedForm.options.symptomSwallow',
    'Dietetics.detailedForm.options.symptomHunger',
    'Dietetics.detailedForm.options.symptomBreath'
  ];
  urineObservationOptions = [
    'Dietetics.detailedForm.options.urineYellow',
    'Dietetics.detailedForm.options.urineFoamy',
    'Dietetics.detailedForm.options.urineSweet',
    'Dietetics.detailedForm.options.urineFoul'
  ];
  bloodUrineTestOptions = [
    'Dietetics.detailedForm.options.testRecently',
    'Dietetics.detailedForm.options.test6Months',
    'Dietetics.detailedForm.options.test1Year'
  ];
  hospitalisationDateOptions = [
    'Dietetics.detailedForm.options.hospitalRecently',
    'Dietetics.detailedForm.options.hospital6Months',
    'Dietetics.detailedForm.options.hospital1Year',
    'Dietetics.detailedForm.options.hospitalRegular'
  ];

  constructor(
    private fb: FormBuilder, 
    private consultFormService: NutritionConsultService,
    private detailedConsultService: DetailedConsultService
  ) {
    this.consultForm = this.fb.group({
      name: ['', Validators.required],
      age: ['', Validators.required],
      contact: ['', Validators.required],
      email: ['', Validators.required],
      sex: ['', Validators.required],
      height: ['', Validators.required],
      weight: ['', Validators.required],
      country: ['', Validators.required],
      referredBy:['', Validators.required],
      socialMediaId: [''],
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
      // snackFrequency: ['', Validators.required],
      snackGroup: this.fb.group({
        types: [[], Validators.required],              // checkbox selections
        frequency: ['', Validators.required],        // radio choice
      }),
      primaryGoal: ['', Validators.required],
      secondaryGoals: [[], Validators.required],
      specificConcerns: [[], Validators.required],
      supplements: [''],
      familyHistory: [[]],
      recentHospitalisation: [false],
      yearlyScreening: [false],
      foodAllergy: [false],
      medication: [false],
      recentTravel: [false],
    });

    // Detailed form
    this.detailedForm = this.fb.group({
      // Basic info fields
      name: ['', Validators.required],
      age: ['', Validators.required],
      contact: ['', Validators.required],
      email: ['', Validators.required],
      sex: ['', Validators.required],
      height: ['', Validators.required],
      weight: ['', Validators.required],
      country: ['', Validators.required],
      referredBy: ['', Validators.required],
      socialMediaId: [''],
      // Detailed form specific fields
      breakfastChoice: [''],
      lunchChoice: [''],
      dinnerTime: [''],
      dinnerChoice: [''],
      waterBeverages: [''],
      lowEnergy: [''],
      constipation: [''],
      cookingOil: [''],
      milkConsumption: [''],
      hungerAfterBreakfast: [''],
      painDiscomfort: [''],
      symptoms: [''],
      urineObservation: [''],
      bloodUrineTest: [''],
      hospitalisationDate: [''],
      urineFrequency: ['']
    });

    // Sample request form
    this.sampleRequestForm = this.fb.group({
      // Basic info fields
      name: ['', Validators.required],
      age: ['', Validators.required],
      contact: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      sex: ['', Validators.required],
      height: ['', Validators.required],
      weight: ['', Validators.required],
      country: ['', Validators.required],
      referredBy: ['', Validators.required],
      socialMediaId: [''],
      // Sample request specific fields
      address: [''],
      message: ['']
    });

    // Set up value change listeners for syncing
    this.setupBasicInfoSync();
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

  setActiveTab(tab: 'basic' | 'detailed' | 'sample') {
    this.activeTab = tab;
  }

  async onSubmitDetailedForm() {
    if(this.detailedForm.value && Object.values(this.detailedForm.value).some(val => val !== '' && val !== null)) {
      const detailedResult = await this.detailedConsultService.submitDetailedForm(this.detailedForm.value)
      
      if(detailedResult.success){
        alert('Detailed form submitted successfully!');
        this.detailedForm.reset()
      } else {
        alert('Detailed form submission failed!')
        console.log('Detailed form error:', detailedResult.error)
      }
    } else {
      alert('Please fill out at least one field in the detailed form!')
    }
  }

  async onSubmitSampleRequest() {
    if(this.sampleRequestForm.valid){
      // TODO: Implement sample request submission service
      alert('Sample request submitted successfully!');
      this.sampleRequestForm.reset()
    } else {
      alert('Please fill up the mandatory fields!')
    }
  }

  setupBasicInfoSync() {
    const basicInfoFields = ['name', 'age', 'contact', 'email', 'sex', 'height', 'weight', 'country', 'referredBy', 'socialMediaId'];
    
    // Listen to changes in each form and sync if checkbox is checked
    basicInfoFields.forEach(field => {
      this.consultForm.get(field)?.valueChanges.subscribe(value => {
        if (this.syncBasicInfo) {
          this.detailedForm.patchValue({ [field]: value }, { emitEvent: false });
          this.sampleRequestForm.patchValue({ [field]: value }, { emitEvent: false });
        }
      });

      this.detailedForm.get(field)?.valueChanges.subscribe(value => {
        if (this.syncBasicInfo) {
          this.consultForm.patchValue({ [field]: value }, { emitEvent: false });
          this.sampleRequestForm.patchValue({ [field]: value }, { emitEvent: false });
        }
      });

      this.sampleRequestForm.get(field)?.valueChanges.subscribe(value => {
        if (this.syncBasicInfo) {
          this.consultForm.patchValue({ [field]: value }, { emitEvent: false });
          this.detailedForm.patchValue({ [field]: value }, { emitEvent: false });
        }
      });
    });
  }

  onSyncBasicInfoChange(checked: boolean) {
    this.syncBasicInfo = checked;
    if (checked) {
      // Sync from active tab to all other tabs
      const basicInfoFields = ['name', 'age', 'contact', 'email', 'sex', 'height', 'weight', 'country', 'referredBy', 'socialMediaId'];
      let sourceForm: FormGroup;
      
      if (this.activeTab === 'basic') {
        sourceForm = this.consultForm;
      } else if (this.activeTab === 'detailed') {
        sourceForm = this.detailedForm;
      } else {
        sourceForm = this.sampleRequestForm;
      }

      const values: any = {};
      basicInfoFields.forEach(field => {
        values[field] = sourceForm.get(field)?.value;
      });

      // Apply to all forms
      if (this.activeTab !== 'basic') {
        this.consultForm.patchValue(values, { emitEvent: false });
      }
      if (this.activeTab !== 'detailed') {
        this.detailedForm.patchValue(values, { emitEvent: false });
      }
      if (this.activeTab !== 'sample') {
        this.sampleRequestForm.patchValue(values, { emitEvent: false });
      }
    }
  }

  async onSubmit() {
    if(this.consultForm.valid){
      // Submit basic form
      const basicResult = await this.consultFormService.submitConsultForm(this.consultForm.value)
      
      if(basicResult.success){
        // Submit detailed form if it has any data
        if(this.detailedForm.value && Object.values(this.detailedForm.value).some(val => val !== '' && val !== null)) {
          const detailedResult = await this.detailedConsultService.submitDetailedForm(this.detailedForm.value)
          
          if(detailedResult.success){
            alert('Both forms submitted successfully!');
            this.consultForm.reset()
            this.detailedForm.reset()
          } else {
            alert('Basic form submitted, but detailed form submission failed!')
            console.log('Detailed form error:', detailedResult.error)
            this.consultForm.reset()
          }
        } else {
          alert('Basic form submitted successfully!');
          this.consultForm.reset()
        }
      } else {
        alert('Form submission failed!')
        console.log('Basic form error:', basicResult.error)
      }
    } else {
      console.log(this.consultForm.value);
      alert('Please fill up the mandatory fields!')
    }
  }

}
