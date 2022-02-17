import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from "@angular/forms";

@Component({
  selector: 'app-projet-control-file',
  templateUrl: './file-control.component.html',
  styleUrls: ['./file-control.component.scss']
})
export class FileControlComponent implements OnInit {

  @Input() form: FormControl = new FormControl();
  @Input() required: boolean = false;
  loading: boolean = false;

  fileName: string = '';

  constructor() { }

  ngOnInit() {

  }

  onFileSelected(event) {
    const file:File = event.target.files[0];
  
    if (file) {
      this.fileName = file.name;
      this.form.setValue(file);
    }
  }

  reset() {
    this.form.setValue(null);
    this.fileName = '';
  }

}
