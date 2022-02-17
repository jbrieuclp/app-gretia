import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared';
import { CdkTableModule } from '@angular/cdk/table';
import { CdkTreeModule } from '@angular/cdk/tree';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { EditorModule, TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular';


import { SynologyComponent } from './components/synology.component';
import { ConnectComponent } from './components/connect/connect.component';
import { SynoConnectionDialog } from './components/connect/dialog/connection.dialog';
import { SynologyRepository } from './synology.repository';
import { SynologyService } from './synology.service';
import { ListComponent } from './components/list/list.component';
import { UploadComponent } from './components/upload/upload.component';
import { FileInfoComponent } from './components/file-info/file-info.component';
import { SynologyDirective } from './components/synology.directive';
import { DisplayFileComponent } from './components/file-info/display-file.component';

@NgModule({
  imports: [
    CommonModule,
    CdkTableModule,
    CdkTreeModule,
    SharedModule,
  ],
  declarations: [  	
    SynologyComponent, 
    ConnectComponent, 
    SynoConnectionDialog,
    ListComponent, 
    UploadComponent, 
    FileInfoComponent,
    SynologyDirective,
    DisplayFileComponent,
  ],
  entryComponents: [
    SynoConnectionDialog,
  ],
  providers: [
    SynologyRepository,
    SynologyService,
  ],
  exports: [
    SynologyComponent,
    SynoConnectionDialog,
    ListComponent, 
    UploadComponent,
    FileInfoComponent,
    SynologyDirective,
  ]
})
export class SynologyModule { }
