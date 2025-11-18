import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NutritionConsultService } from '../../services/consult.service';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-dietetics',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, TranslatePipe],
  templateUrl: './dietetics.component.html',
  styleUrl: './dietetics.component.scss'
})
export class DieteticsComponent {
  consultForm: FormGroup;

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
  
  // New question options
  breakfastFoodChoices = [
    'Dietetics.options.breakfastToastButter',
    'Dietetics.options.breakfastHamBaconEggs',
    'Dietetics.options.breakfastPancakesHashBrowns',
    'Dietetics.options.breakfastProteinShakesOats',
    'Dietetics.options.breakfastFreshFruits',
    'Dietetics.options.breakfastBlackCoffeeMilo',
    'Dietetics.options.breakfastNoodlesNasiLemak'
  ];
  lunchFoodChoices = [
    'Dietetics.options.lunchCarbsMeat',
    'Dietetics.options.lunchTubersVegetables',
    'Dietetics.options.lunchNasiKandarNoodles',
    'Dietetics.options.lunchProteinShakesOats',
    'Dietetics.options.lunchSoupsCongee'
  ];
  dinnerSupperTimeOptions = [
    'Dietetics.options.dinnerBefore6pmSupper10pm',
    'Dietetics.options.dinnerBefore8pmNoSupper',
    'Dietetics.options.dinnerAfter8pm',
    'Dietetics.options.skipDinner'
  ];
  dinnerFoodChoices = [
    'Dietetics.options.dinnerCarbsMeatNoodles',
    'Dietetics.options.dinnerVegeMushroomsSoups',
    'Dietetics.options.dinnerSoupsSeafood',
    'Dietetics.options.dinnerBreadBiscuitsSandwiches',
    'Dietetics.options.dinnerProteinShakesOatsMilk',
    'Dietetics.options.dinnerMixSaladsFreshFruit'
  ];
  waterBeveragesPerDayOptions = [
    'Dietetics.options.waterMoreThan5Cups',
    'Dietetics.options.waterMoreThan3CupsBeverages',
    'Dietetics.options.waterMoreThan3CupsAlkaline'
  ];
  lowEnergyTiredOptions = [
    'Dietetics.options.lowEnergyMorning',
    'Dietetics.options.lowEnergyAfter5pm',
    'Dietetics.options.lowEnergySleepyAfterNoon',
    'Dietetics.options.lowEnergyUnableToSleep'
  ];
  constipationLooseMotionOptions = [
    'Dietetics.options.constipationDaily',
    'Dietetics.options.constipationThriceWeekly',
    'Dietetics.options.constipationSuddenSpells'
  ];
  cookingOilsOptions = [
    'Dietetics.options.cookingOilsCoconutSesame',
    'Dietetics.options.cookingOilsCanolaSunflower'
  ];
  milkNonDairyOptions = [
    'Dietetics.options.milkInCoffeeTea',
    'Dietetics.options.nonDairyCreamer',
    'Dietetics.options.threeInOneBeverage',
    'Dietetics.options.glassWarmMilk'
  ];
  hoursAfterBreakfastHungryOptions = [
    'Dietetics.options.hungryLessThan4Hours',
    'Dietetics.options.hungryBetween7And8Hours',
    'Dietetics.options.hungryCoffeeBreak10am'
  ];
  painDiscomfortPartsOptions = [
    'Dietetics.options.painJoints',
    'Dietetics.options.painNeckShoulder',
    'Dietetics.options.painLowerLimbs',
    'Dietetics.options.painBackGroin',
    'Dietetics.options.painRibCage'
  ];
  symptomsFrequencyOptions = [
    'Dietetics.options.symptomPainBelly',
    'Dietetics.options.symptomMotionAfterEating',
    'Dietetics.options.symptomConstipation',
    'Dietetics.options.symptomHeartburnReflux',
    'Dietetics.options.symptomNauseaVomiting',
    'Dietetics.options.symptomDifficultToSwallow',
    'Dietetics.options.symptomHungerPangsThirsty',
    'Dietetics.options.symptomBadBreathBodyOdour'
  ];
  basicUrineObservationOptions = [
    'Dietetics.options.urineYellowDarkYellow',
    'Dietetics.options.urineFoamySweetSmell',
    'Dietetics.options.urineFoulSmell',
    'Dietetics.options.urineRegularClear'
  ];
  fullBloodUrineTestDateOptions = [
    'Dietetics.options.testRecently',
    'Dietetics.options.test6MonthsAgo',
    'Dietetics.options.testMoreThan1Year'
  ];
  dateOfHospitalisationOptions = [
    'Dietetics.options.hospitalisationRecently',
    'Dietetics.options.hospitalisation6MonthsAgo',
    'Dietetics.options.hospitalisationMoreThan1Year'
  ];

  constructor(private fb: FormBuilder, private consultFormService: NutritionConsultService) {
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
      // New form fields
      breakfastFoodChoices: ['', Validators.required],
      lunchFoodChoices: ['', Validators.required],
      dinnerSupperTime: ['', Validators.required],
      dinnerFoodChoices: ['', Validators.required],
      waterBeveragesPerDay: ['', Validators.required],
      lowEnergyTired: ['', Validators.required],
      constipationLooseMotion: ['', Validators.required],
      cookingOils: ['', Validators.required],
      milkNonDairyConsumption: ['', Validators.required],
      hoursAfterBreakfastHungry: ['', Validators.required],
      painDiscomfortParts: [[], Validators.required],
      symptomsFrequency: [[], Validators.required],
      basicUrineObservation: [''],
      fullBloodUrineTestDate: ['', Validators.required],
      dateOfHospitalisation: ['', Validators.required],
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

  // check if a checkbox value is selected
  isCheckboxSelected(field: string, value: string): boolean {
    const selected = this.consultForm.get(field)?.value || [];
    return selected.includes(value);
  }

  async onSubmit() {
    if(this.consultForm.valid){
      const result = await this.consultFormService.submitConsultForm(this.consultForm.value)
      if(result.success){
        alert('Form submitted!');
        this.consultForm.reset()
      }else {
        alert('Form submission failed!')
        console.log(result.error)
      }
    } else {
      console.log(this.consultForm.value);
      alert('Please fill up the mandatory fields!')
    }
  }

}
