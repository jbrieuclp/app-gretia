import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from "@angular/forms";
import { tap, map } from "rxjs/operators";
import { WorksRepository } from '@projet/repository/works.repository';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  form: FormGroup;

  constructor(private fb: FormBuilder,private workR: WorksRepository,) { }

  ngOnInit() {
    this.form = this.fb.group({
      study: [1093, [Validators.required]],
      expenseDate: ['2022-02-10', [Validators.required]],
      chargeType: [1, [Validators.required]],
      provider: ['test', [Validators.required]],
      details: ['a supprimer'],
      amountExclTax: [null, []],
      vat: [null, []],
      amountInclTax: [1, [Validators.required]],
      // file: [],
      files: this.fb.array([]),
    });

    this.addFile();
    this.addFile();
  }

  get files(): FormArray {
    return this.form.get("files") as FormArray
  }

  addFile() {
    this.files.push(new FormControl(''));
  }

  removeFile(i:number) {
    this.files.removeAt(i);
  }

  submit() {
    const data = Object.assign({}, this.form.value);

    const formData = new FormData();
    for (const [key, value] of Object.entries(data)) {
      console.log(key, value);
      if (key === 'files') {
        (value as File[]).forEach((file) => {
          formData.append('file[]', <Blob> file);
        })
      } else {
        formData.append(key, <string|Blob> value);
      }
    }
    console.log(formData);

    // this.workR.postMyExpenses(formData)
    //   .subscribe((res) => console.log(res));
  }
}
