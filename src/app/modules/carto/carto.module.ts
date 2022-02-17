import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { GrPanelModule } from '../../shared/templates/gr-panel/gr-panel.module';

//modules
import { CartoRoutingModule } from './carto-routing.module';

//components
import { CartoComponent } from './components/carto.component';
import { FondsPlanPanelComponent, FondsPlanDialog } from './components/template/left-panel/fonds-plan.component';
import { CartoInitComponent } from './carto-init.component';
import { LeftPanelComponent } from './components/template/left-panel/left-panel.component';
import { GridsPanelComponent, GridsPanelDialog } from './components/template/left-panel/grids-panel.component';
import { RightPanelComponent, RightPanelDialog } from './components/template/right-panel/right-panel.component';
import { TimePanelComponent, TimePanelDialog } from './components/template/left-panel/time-panel.component';
import { TerritoryPanelComponent, TerritoryPanelDialog } from './components/template/left-panel/territory-panel.component';
import { SearchTaxonComponent } from './components/template/right-panel/search-taxon/search-taxon.component';
import { TaxonsPanelComponent } from './components/template/right-panel/taxons-panel/taxons-panel.component';
import { LegendeComponent, LegendTuneDialog } from './components/template/legende/legende.component';
import { IndicateursPanelComponent } from './components/template/right-panel/indicateurs-panel/indicateurs-panel.component';
import { TooltipDialog } from './components/tooltip/tooltip.dialog';
import { TooltipContentComponent } from './components/tooltip/tooltip-content.component';
import { TooltipTaxonsComponent } from './components/tooltip/composents/tt-taxons/tt-taxons.component';
import { ImagesComponent, ImageDialog } from './components/template/images/images.component';
import { TooltipCommunesComponent } from './components/tooltip/composents/tt-communes/tt-communes.component';
import { TooltipObservateursComponent } from './components/tooltip/composents/tt-observateurs/tt-observateurs.component';

//services
import { CartoService } from './services/carto.service';
import { LayerService } from './services/layer.service';
import { TaxrefApiService } from '../../shared/services/taxref-api.service';

//directives

@NgModule({
  exports: [
  ],
  imports: [
    CommonModule,
    FormsModule, 
    ReactiveFormsModule,
    MatToolbarModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatListModule,
    MatIconModule,
    MatDialogModule,
    MatTooltipModule,
    MatExpansionModule,
    MatCheckboxModule,
    MatSliderModule,
    MatSidenavModule,
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressBarModule,
    MatSlideToggleModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatDatepickerModule,
    MatSelectModule,
    MatBadgeModule,
    MatTableModule,
    CartoRoutingModule,
    NgbModule,
    GrPanelModule
  ],
  declarations: [
    CartoComponent,
    CartoInitComponent,
    LeftPanelComponent,
    FondsPlanPanelComponent,
    FondsPlanDialog,
    RightPanelComponent,
    RightPanelDialog,
    SearchTaxonComponent,
    TaxonsPanelComponent,
    LegendeComponent,
    LegendTuneDialog,
    IndicateursPanelComponent,
    GridsPanelComponent,
    GridsPanelDialog,
    TimePanelComponent, 
    TimePanelDialog,
    TerritoryPanelComponent, 
    TerritoryPanelDialog,
    TooltipDialog,
    TooltipContentComponent,
    TooltipTaxonsComponent,
    ImagesComponent, 
    ImageDialog, 
    TooltipCommunesComponent, 
    TooltipObservateursComponent
  ],
  entryComponents: [ 
    FondsPlanDialog,
    RightPanelDialog,
    GridsPanelDialog,
    TimePanelDialog,
    TerritoryPanelDialog,
    TooltipDialog,
    ImageDialog,
    LegendTuneDialog
  ],
  providers: [
    CartoService,
    LayerService,
    TaxrefApiService
  ],
  bootstrap: [CartoComponent]
})
export class CartoModule { }