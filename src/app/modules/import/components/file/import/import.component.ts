import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { ImportService } from '../../../services/import.service';

@Component({
  selector: 'app-import',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.scss']
})
export class FileImportComponent implements OnInit {

	file: any;
	fileName: any;
	uploadForm: FormGroup;
	@ViewChild('fileInput', { static: true })
  fileInput: ElementRef;
  error: any;

  constructor(
  	private fb: FormBuilder,
  	private router: Router,
  	private route: ActivatedRoute,
  	private importS: ImportService
  ) { }

  ngOnInit() {
  	this.uploadForm = this.fb.group({
  		'table': ['', [Validators.required]],
      'file': ['', [Validators.required]]
  	}); 
  }

  onSelectFile(event) {
    if(event.target.files && event.target.files.length > 0) {
      this.file = event.target.files[0];
      this.uploadForm.get('file').setValue(this.file.name);
      this.fileName = this.file.name;
    }
  }

  sendFile() {
    const data: FormData = new FormData();
    data.append('file', this.file, this.file.name );
    data.append('table', this.uploadForm.value.table);
    this.importS.updloadFile(data)
    .subscribe(fichier => {
    	this.router.navigate(['../fichier', fichier.id], { relativeTo: this.route });
      }, 
      error => this.error = error.error['hydra:description']
    );
  }

  selectFile(): void {
    this.fileInput.nativeElement.click();
  }

}
