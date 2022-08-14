import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [LandingPageComponent],
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  exports: [LandingPageComponent],
})
export class LandingPageModule {}
