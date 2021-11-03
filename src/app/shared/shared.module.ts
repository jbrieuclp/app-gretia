import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatBadgeModule } from '@angular/material/badge';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTreeModule } from '@angular/material/tree';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { LayoutModule } from './layout/layout.module';

//Dialog
import { ConfirmationDialogComponent } from './components/confirmation-dialog/confirmation-dialog.component';

//Pipes
import { KeysPipe } from './pipes/keys.pipe';
import { TimeFormatPipe } from './pipes/time-format.pipe';
import { SortByPipe } from './pipes/sort-by.pipe';

//Directives
import { ColorDifferenceDirective } from './directives/color-difference.directive';
import { BackButtonDirective } from './directives/back-button.directive';

//Services
import { GlobalsService } from './services/globals.service';
import { LoaderComponent } from './templates/loader/loader.component';
import { SubmitBtnComponent } from './templates/submit-btn/submit-btn.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatIconModule,
    MatTooltipModule,
    MatTableModule,
    MatCardModule,
    MatTabsModule,
    MatListModule,
    MatInputModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatCheckboxModule,
    MatRadioModule,
    MatDialogModule,
    MatSnackBarModule,
    MatStepperModule,
    MatProgressSpinnerModule,
    MatExpansionModule,
    MatBadgeModule,
    MatBottomSheetModule,
    MatPaginatorModule,
    MatSortModule,
    MatTreeModule,
    MatSelectModule,
    MatDatepickerModule,
    MatProgressBarModule,
    MatMenuModule,
    MatSliderModule,
    MatSlideToggleModule,
    LayoutModule,
  ],
  declarations: [
    ConfirmationDialogComponent,
    KeysPipe,
    TimeFormatPipe,
    SortByPipe,
    ColorDifferenceDirective,
    LoaderComponent,
    SubmitBtnComponent,
    BackButtonDirective
  ],
  entryComponents: [
    ConfirmationDialogComponent
  ],
  providers: [
    GlobalsService
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatIconModule,
    MatTooltipModule,
    MatTableModule,
    MatCardModule,
    MatTabsModule,
    MatListModule,
    MatInputModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatCheckboxModule,
    MatRadioModule,
    MatDialogModule,
    MatSnackBarModule,
    MatStepperModule,
    MatProgressSpinnerModule,
    MatExpansionModule,
    MatBadgeModule,
    MatBottomSheetModule,
    MatPaginatorModule,
    MatSortModule,
    MatTreeModule,
    MatSelectModule,
    MatDatepickerModule,
    MatProgressBarModule,
    MatMenuModule,
    MatSliderModule,
    MatSlideToggleModule,
    LayoutModule,
    ConfirmationDialogComponent,
    KeysPipe,
    TimeFormatPipe,
    SortByPipe,
    ColorDifferenceDirective,
    LoaderComponent,
    SubmitBtnComponent,
    BackButtonDirective
  ]
})
export class SharedModule { }
