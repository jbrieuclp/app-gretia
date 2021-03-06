import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../../shared';

//modules
import { ImportRoutingModule } from './import-routing.module';

//components
import { FilesListComponent } from './components/file/list/list.component';
import { ImportInitComponent } from './import-init.component';
import { FileDashboardComponent } from './components/file/dashboard/dashboard.component';
import { FileMapperComponent } from './components/file/mapper/mapper.component';
import { FormMapperComponent } from './components/file/mapper/form-mapper.component';
import { FieldListComponent } from './components/field/list/list.component';
import { 
  ElementComponent, 
  EditRadioDialog, 
  EditInputDialog, 
  EditAutocompleteDialog 
} from './components/field/list/element.component';
import { ViewTableDialog } from './components/field/list/view-table.dialog';
import { FieldObserversComponent } from './components/field/observers/observers.component';
import { EditObserverComponent } from './components/field/observers/edit-observer.component';
import { ToolsboxComponent } from './components/field/toolsbox/toolsbox.component';
import { FileImportComponent } from './components/file/import/import.component';
import { TableComponent } from './components/file/table/table.component';
import { 
  FileRequiredFieldComponent, 
  FileRequiredFieldDialog 
} from './components/file/required-field/required-field.component';
import { AddObserverComponent } from './components/field/observers/add-observer.component';
import { FieldLocalisationsComponent } from './components/field/localisations/localisations.component';
import { CellComponent } from './components/file/table/cell.component';
import { FileAddFieldComponent } from './components/file/add-field/add-field.component';
import { RegexpReplaceComponent } from './components/field/toolsbox/tools/regexp-replace.component';
import { ReplaceEmptyByFieldComponent } from './components/field/toolsbox/tools/replace-empty-by-field.component';
import { SearchReplaceComponent } from './components/field/toolsbox/tools/search-replace.component';
import { SearchLocComponent } from './components/field/localisations/search-loc.component';
import { CoordinateComponent } from './components/field/localisations/coordinate.component';
import { LocTableDialog } from './components/field/localisations/loc-table.dialog';

//services
import { ImportService } from './services/import.service';
import { FileDataService } from './services/file.service';
import { FormMapperService } from './components/file/mapper/form-mapper.service';
import { FieldService } from './components/field/field.service';
import { LocalisationService } from './components/field/localisations/localisation.service';

//directives
import { AutofocusDirective } from './directives/autofocus.directive';
import { FileInsertComponent } from './components/file/insert/insert.component';
import { DuplicateLinesComponent } from './components/file/duplicate-lines/duplicate-lines.component';
import { ExistsInDbComponent } from './components/file/exists-in-db/exists-in-db.component';
import { RegroupingComponent } from './components/file/regrouping/regrouping.component';
import { RecapComponent } from './components/file/recap/recap.component';
import { TaxonomieComponent } from './components/field/taxonomie/taxonomie.component';

@NgModule({
  exports: [
  ],
  imports: [
    CommonModule,
    FormsModule, 
    ReactiveFormsModule,
    ImportRoutingModule,
    NgbModule,
    SharedModule
  ],
  declarations: [
    ImportInitComponent,
    FilesListComponent,
    FileDashboardComponent,
    FileMapperComponent,
    FormMapperComponent,
    FieldListComponent,
    ElementComponent,
    EditInputDialog,
    EditAutocompleteDialog,
    EditRadioDialog,
    FieldObserversComponent,
    EditObserverComponent,
    ToolsboxComponent,
    AutofocusDirective,
    AddObserverComponent,
    FileImportComponent,
    FieldLocalisationsComponent,
    ViewTableDialog,
    TableComponent,
    CellComponent,
    FileAddFieldComponent,
    FileRequiredFieldComponent,
    FileRequiredFieldDialog,
    FileInsertComponent,
    DuplicateLinesComponent,
    ExistsInDbComponent,
    RegroupingComponent,
    RegexpReplaceComponent,
    SearchReplaceComponent,
    ReplaceEmptyByFieldComponent,
    RecapComponent,
    TaxonomieComponent,
    SearchLocComponent,
    CoordinateComponent,
    LocTableDialog
  ],
  entryComponents: [ 
    EditInputDialog,
    EditAutocompleteDialog,
    EditRadioDialog,
    ViewTableDialog,
    ToolsboxComponent,
    FileRequiredFieldDialog,
    LocTableDialog
  ],
  providers: [
    ImportService,
    FileDataService,
    FormMapperService,
    FieldService,
    LocalisationService
  ],
  bootstrap: [FilesListComponent]
})
export class ImportModule { }